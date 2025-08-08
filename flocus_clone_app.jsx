import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Moon, Sun, PlusCircle, CheckCircle, Trash2 } from "lucide-react";

interface Todo {
  text: string;
  completed: boolean;
  dueDate?: string;
  createdAt: number;
}

export default function App() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [audioUrl, setAudioUrl] = useState(() => localStorage.getItem("audioUrl") || "");
  const [background, setBackground] = useState(() => localStorage.getItem("background") || "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [todoInput, setTodoInput] = useState("");
  const [todoDate, setTodoDate] = useState("");
  const [todos, setTodos] = useState<Todo[]>(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("background", background);
  }, [background]);

  useEffect(() => {
    localStorage.setItem("audioUrl", audioUrl);
  }, [audioUrl]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos([...todos, {
        text: todoInput.trim(),
        completed: false,
        dueDate: todoDate || undefined,
        createdAt: Date.now(),
      }]);
      setTodoInput("");
      setTodoDate("");
    }
  };

  const toggleComplete = (index: number) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const removeTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return a.createdAt - b.createdAt;
  });

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-500 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="backdrop-blur-md bg-black/50 dark:bg-black/60 p-6 rounded-2xl shadow-lg w-full max-w-md">
        <Card>
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <div className="flex justify-between w-full">
              <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
              <Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun /> : <Moon />}
              </Button>
            </div>

            <div className="text-5xl font-mono">
              {minutes}:{seconds}
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? <Pause /> : <Play />}
              </Button>
              <Button onClick={() => {
                setIsRunning(false);
                setSecondsLeft(25 * 60);
              }}>
                <RotateCcw />
              </Button>
            </div>

            <div className="w-full">
              <label className="block mb-1">Background image URL</label>
              <Input
                placeholder="Enter image URL..."
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block mb-1">Audio URL (mp3)</label>
              <Input
                placeholder="Enter music URL..."
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
              />
              {audioUrl && (
                <audio controls autoPlay loop className="mt-2 w-full">
                  <source src={audioUrl} type="audio/mp3" />
                </audio>
              )}
            </div>

            <div className="w-full">
              <label className="block mb-1">To-do List</label>
              <div className="flex flex-col gap-2 mb-2">
                <Input
                  placeholder="New task..."
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                />
                <Input
                  type="date"
                  value={todoDate}
                  onChange={(e) => setTodoDate(e.target.value)}
                />
                <Button onClick={addTodo} variant="secondary" className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Task
                </Button>
              </div>
              <ul className="space-y-2">
                {sortedTodos.map((task, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-start px-2 py-2 bg-white/10 rounded-lg flex-col sm:flex-row sm:items-center"
                  >
                    <div
                      onClick={() => toggleComplete(index)}
                      className={`flex-1 cursor-pointer ${task.completed ? "line-through text-gray-400" : ""}`}
                    >
                      <div>{task.text}</div>
                      {task.dueDate && (
                        <div className="text-sm text-gray-300">Due: {task.dueDate}</div>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2 sm:mt-0">
                      <Button variant="ghost" size="icon" onClick={() => toggleComplete(index)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTodo(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
