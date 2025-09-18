"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Send, X, Minimize2, HelpCircle, TrendingUp, TrendingDown, DollarSign, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  type: "user" | "system" | "success" | "error"
  content: string
  timestamp: Date
}

interface Command {
  category: string
  command: string
  description: string
  format: string
  examples: string[]
  icon?: React.ReactNode
}

const AVAILABLE_COMMANDS: Command[] = [
  {
    category: "Trading",
    command: "LONG/SHORT",
    description: "Open a long or short position",
    format: "[LONG|SHORT] [ASSET] [LEVERAGE]X $[AMOUNT]",
    examples: [
      "LONG BTC 5X $1000",
      "SHORT ETH 3X $500", 
      "LONG HYPE 10X $2000"
    ],
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    category: "Trading", 
    command: "CLOSE",
    description: "Close existing positions",
    format: "CLOSE [ASSET|ALL|PERCENTAGE% ASSET]",
    examples: [
      "CLOSE BTC",
      "CLOSE ALL",
      "CLOSE 50% BTC"
    ],
    icon: <X className="h-4 w-4" />
  },
  {
    category: "Portfolio",
    command: "BALANCE",
    description: "Check account balance and positions",
    format: "[BALANCE|SHOW POSITIONS|PNL] [TIMEFRAME?]",
    examples: [
      "BALANCE",
      "SHOW POSITIONS",
      "PNL"
    ],
    icon: <DollarSign className="h-4 w-4" />
  },
  {
    category: "Orders",
    command: "LIMIT/STOP",
    description: "Place limit or stop orders",
    format: "[LIMIT|STOP LOSS|TAKE PROFIT] [BUY|SELL?] [ASSET] $[PRICE] $[AMOUNT?]",
    examples: [
      "LIMIT BUY BTC $50000 $1000",
      "STOP LOSS BTC $45000",
      "TAKE PROFIT ETH $3500"
    ],
    icon: <Settings className="h-4 w-4" />
  },
  {
    category: "Market",
    command: "PRICE",
    description: "Get current market prices",
    format: "[PRICE|MARKET STATUS] [ASSET1 ASSET2?]",
    examples: [
      "PRICE BTC",
      "PRICE ETH HYPE",
      "MARKET STATUS"
    ],
    icon: <TrendingDown className="h-4 w-4" />
  }
]

export function TradingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "system",
      content: "Welcome to Trade Command Interface! Use specific command formats to execute trades. Check the Commands tab to see all available formats and examples. Type /help for quick reference.",
      timestamp: new Date()
    }
  ])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user", 
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    
    // Handle help command
    if (input.trim().toLowerCase() === "/help") {
      setTimeout(() => {
        const helpMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "system",
          content: "Check the Commands tab to see all available commands and examples!",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, helpMessage])
        setActiveTab("commands")
      }, 300)
    } else {
      // Simulate processing
      setTimeout(() => {
        const systemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "system",
          content: `Processing trade command: "${input.trim()}"`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, systemMessage])
      }, 500)
    }

    setInput("")
  }

  const insertCommand = (example: string) => {
    setInput(example)
    setActiveTab("chat")
  }

  const groupedCommands = AVAILABLE_COMMANDS.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getMessageBadgeVariant = (type: ChatMessage['type']) => {
    switch (type) {
      case "user": return "default"
      case "success": return "default" // green
      case "error": return "destructive"
      default: return "secondary"
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="default"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={cn(
      "fixed z-50 shadow-2xl border bg-background",
      isMinimized 
        ? "bottom-6 right-6 w-[480px] h-14" 
        : "bottom-6 right-6 w-[480px] h-[600px]"
    )}>
      <CardHeader className="pb-3 px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Trade Chat
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="px-4 pb-4 flex flex-col h-[540px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="commands" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Commands
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
              <ScrollArea className="h-[360px] mb-4 pr-2">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={getMessageBadgeVariant(message.type)}
                          className="text-xs"
                        >
                          {message.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div className={cn(
                        "p-3 rounded-lg text-sm",
                        message.type === "user" 
                          ? "bg-primary text-primary-foreground ml-8" 
                          : "bg-muted mr-8"
                      )}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., LONG HYPE 10X $500 or /help"
                  className="flex-1"
                />
                <Button onClick={handleSend} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                Type /help or check Commands tab for all available commands
              </div>
            </TabsContent>
            
            <TabsContent value="commands" className="flex-1 flex flex-col mt-4">
              <ScrollArea className="h-[420px] pr-2">
                <div className="space-y-4 pb-4">
                  {Object.entries(groupedCommands).map(([category, commands]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                        {commands[0].icon}
                        {category}
                      </div>
                      <div className="space-y-2 ml-6">
                        {commands.map((cmd, idx) => (
                          <div key={idx} className="space-y-3 p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm">{cmd.command}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">{cmd.description}</div>
                            
                            <div className="space-y-1">
                              <div className="text-xs font-medium text-foreground">Format:</div>
                              <div className="font-mono text-xs bg-background/50 p-2 rounded border text-primary">
                                {cmd.format}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="text-xs font-medium text-foreground">Examples:</div>
                              <div className="space-y-1">
                                {cmd.examples.map((example, exIdx) => (
                                  <Button
                                    key={exIdx}
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-2 justify-start font-mono text-xs hover:bg-primary/10 w-full"
                                    onClick={() => insertCommand(example)}
                                  >
                                    {example}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {category !== Object.keys(groupedCommands)[Object.keys(groupedCommands).length - 1] && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}