package main

import (
  "fmt"
  "net/http"
  "github.com/coder/websocket"
  "github.com/coder/websocket/wsjson"
  "encoding/json"
  "context"
  "time"
  "flag"
  "bufio"
  "math"
  "os"
  "strings"
  "crypto/sha512"
)

var (
  config      map[string]string
  level       float64
)

func loadConfig(path string) (map[string]string, error) {
  config := make(map[string]string)

  file, err := os.Open(path)
  if err != nil {
    return nil, err
  }
  defer file.Close()

  scanner := bufio.NewScanner(file)
  for scanner.Scan() {
    line := scanner.Text()
    if strings.HasPrefix(line, "#") || strings.TrimSpace(line) == "" {
      continue
    }

    parts := strings.SplitN(line, "=", 2)
    if len(parts) != 2 {
      continue
    }

    key := strings.TrimSpace(parts[0])
    value := strings.TrimSpace(parts[1])
    config[key] = value
  }

  return config, scanner.Err()
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
  c, err := websocket.Accept(w, r, nil)
  if err != nil {
    fmt.Println("Error accepting WebSocket client:", err)
    c.Close(websocket.StatusInvalidFramePayloadData, "")
    return
  }
  defer c.CloseNow()

  ctx, cancel := context.WithTimeout(context.Background(), time.Second*3)
  defer cancel()

  var v map[string]string
  err = wsjson.Read(ctx, c, &v)
  if err != nil {
    fmt.Println("Error authenticating WebSocket client:", err)
    c.Close(websocket.StatusInvalidFramePayloadData, "")
    return
  }
  if (v["password"] == "") {
    fmt.Println("WebSocket client has no password:", err)
    c.Close(websocket.StatusInvalidFramePayloadData, "")
    return
  }

  password := v["password"]
  passwordBytes := []byte(password)
  passwordHash := sha512.Sum512(passwordBytes)
  passwordHashHex := fmt.Sprintf("%x", passwordHash)
  if passwordHashHex != config["POLL_PASSWORD_HASH"] {
    fmt.Print("Invalid password from ", r.RemoteAddr)
    fmt.Print(", passwordHashHex: ", passwordHashHex)
    err = wsjson.Write(ctx, c, map[string]string {"error": "Invalid credentials"} )
    time.Sleep(100 * time.Millisecond)
    c.Close(websocket.StatusInvalidFramePayloadData, "")
    return
  }

  ctx = context.Background()

  oldLevel := level
  for {
    for oldLevel == level {
      time.Sleep(200 * time.Millisecond)
    }

    out := map[string]float64{ "new_level": math.Round(level * 1000) / 1000}

    err = wsjson.Write(ctx, c, out)
    oldLevel = level

    if err != nil {
      fmt.Println("Error writing level update:", err)
      break
    }
  }

  c.Close(websocket.StatusNormalClosure, "")
}

func updateHandler(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodPost {
    http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
    return
  }

  authHeader := r.Header.Get("Authorization")

  if authHeader == "" {
    http.Error(w, "", http.StatusBadRequest)
    return
  }

  var data map[string]interface{}
  err := json.NewDecoder(r.Body).Decode(&data)
  if err != nil {
    http.Error(w, "Invalid JSON", http.StatusBadRequest)
    return
  }

  if !strings.HasPrefix(authHeader, "Bearer ") {
    http.Error(w, "", http.StatusForbidden)
    return
  }

  password := strings.TrimPrefix(authHeader, "Bearer ")
  passwordBytes := []byte(password)
  passwordHash := sha512.Sum512(passwordBytes)
  passwordHashHex := fmt.Sprintf("%x", passwordHash)
  if passwordHashHex != config["PUSH_PASSWORD_HASH"] {
    fmt.Print("Invalid password from ", r.RemoteAddr)
    fmt.Println(", passwordHashHex:", passwordHashHex)
    http.Error(w, "", http.StatusForbidden)
    return
  }

  if data["new_level"] != "" {
    newLevel, ok := data["new_level"].(float64)
    if !ok {
      http.Error(w, "", http.StatusBadRequest)
      return
    }
    if (newLevel != level) {
      fmt.Println("New level:", level, "%")
    }
    level = newLevel
  }
}

func main() {
  var configPath string

  flag.StringVar(&configPath, "c", "", "Short config flag")
  flag.StringVar(&configPath, "config", "", "Long config flag")

  for i, arg := range os.Args {
      if strings.HasPrefix(arg, "--config==") {
          os.Args[i] = strings.Replace(arg, "==", "=", 1)
      }
      if strings.HasPrefix(arg, "-c==") {
          os.Args[i] = strings.Replace(arg, "==", "=", 1)
      }
  }

  flag.Parse()

  if (configPath == "") {
    configPath = "/etc/ivalert.cfg"
  }

  fmt.Println("Config file:", configPath)

  configRead, err := loadConfig(configPath)
  if err != nil {
    fmt.Println("Error loading config:", err)
    return
  }

  if configRead["PUSH_PASSWORD_HASH"] == "" {
    fmt.Println("ERROR: No push password hash in configuration.")
    return
  } else if configRead["POLL_PASSWORD_HASH"] == "" {
    fmt.Println("ERROR: No poll password hash in configuration.")
    return
  } else if configRead["PORT"] == "" {
    fmt.Println("ERROR: No port in configuration.")
    return
  }

  fmt.Println("Config file loaded!")

  level = 0
  config = configRead

  http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
    http.Error(w, "", http.StatusNotFound)
    return
  })

  http.HandleFunc("/live_update", wsHandler)
  http.HandleFunc("/iv_post", updateHandler)

  fmt.Println("Listening in port %s...", configRead["PORT"])
  http.ListenAndServe(fmt.Sprintf(":%s", configRead["PORT"]), nil)
}
