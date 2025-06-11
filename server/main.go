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
  "os"
  "strings"
)

var (
  config      map[string]string
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

func updateHandler(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodPost {
    http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
    return
  }

  var data map[string]string
  err := json.NewDecoder(r.Body).Decode(&data)
  if err != nil {
    http.Error(w, "Invalid JSON", http.StatusBadRequest)
    return
  }

  fmt.Println("received: %v", data)
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

  fmt.Println("Config file loaded!")

  config = configRead

  http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to my website!")
  })

  wsHandler := http.HandlerFunc(func (w http.ResponseWriter, r *http.Request) {
    c, err := websocket.Accept(w, r, nil)
    if err != nil {
      fmt.Println("Error accepting WebSocket client:", err)
      c.Close(websocket.StatusInvalidFramePayloadData, "")
      return
    }
    defer c.CloseNow()

    ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
    defer cancel()

    var v interface{}
    err = wsjson.Read(ctx, c, &v)
    if err != nil {
      fmt.Println("Error receiving WebSocket data:", err)
      c.Close(websocket.StatusInvalidFramePayloadData, "")
      return
    }

    fmt.Println("received: %v", v)

    c.Close(websocket.StatusNormalClosure, "")
  })
  http.HandleFunc("/live_update", wsHandler)

  fmt.Println("Listening in port %s...", configRead["PORT"])
  http.ListenAndServe(fmt.Sprintf(":%s", configRead["PORT"]), nil)
}
