import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

export default function Login({ switchToSignup }) {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values) => {
    setError('');
    try {
      const result = await login(values);
      if (result.success) {
        // Navigate to dashboard specifically
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Failed to login');
        form.setError("root", { message: result.error || 'Failed to login' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      form.setError("root", { message: 'An unexpected error occurred' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />
            <Button variant="link" type="button" className="px-0">
              Forgot password?
            </Button>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Button variant="link" type="button" onClick={switchToSignup} className="px-1">
              Sign up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}