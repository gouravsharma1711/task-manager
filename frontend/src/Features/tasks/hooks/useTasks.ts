import { useTaskStore } from '../context/taskContext';
import { taskApi, type CreateTaskDto, type TaskFilterParams } from '../services/task.api';

export const useTasks = () => {
  const { tasks, setTasks, isLoading, setIsLoading, error, setError } = useTaskStore();

  // Load tasks with optional filters from the backend
  const fetchTasks = async (filters?: TaskFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.getTasks(filters);
      // Sort tasks by newest first (descending by createdAt)
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTasks(sorted);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new task and add it to the top of the state list
  const addTask = async (taskData: CreateTaskDto) => {
    setError(null);
    try {
      const createdTask = await taskApi.createTask(taskData);
      setTasks((prev) => [createdTask, ...prev]);
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create task';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Toggle task completed status
  const toggleStatus = async (id: string) => {
    try {
      const updatedTask = await taskApi.toggleTaskStatus(id);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update task status';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Delete a task
  const removeTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete task';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleStatus,
    removeTask,
  };
};

