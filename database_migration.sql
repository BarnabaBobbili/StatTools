-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create saved_analyses table
CREATE TABLE public.saved_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  analysis_type TEXT NOT NULL,
  data JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on saved_analyses
ALTER TABLE public.saved_analyses ENABLE ROW LEVEL SECURITY;

-- Users can view their own analyses
CREATE POLICY "Users can view their own analyses"
ON public.saved_analyses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own analyses
CREATE POLICY "Users can create their own analyses"
ON public.saved_analyses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update their own analyses"
ON public.saved_analyses
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete their own analyses"
ON public.saved_analyses
FOR DELETE
USING (auth.uid() = user_id);

-- Create saved_datasets table
CREATE TABLE public.saved_datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on saved_datasets
ALTER TABLE public.saved_datasets ENABLE ROW LEVEL SECURITY;

-- Users can view their own datasets
CREATE POLICY "Users can view their own datasets"
ON public.saved_datasets
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own datasets
CREATE POLICY "Users can create their own datasets"
ON public.saved_datasets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own datasets
CREATE POLICY "Users can update their own datasets"
ON public.saved_datasets
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own datasets
CREATE POLICY "Users can delete their own datasets"
ON public.saved_datasets
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_analyses_updated_at
BEFORE UPDATE ON public.saved_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_datasets_updated_at
BEFORE UPDATE ON public.saved_datasets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets for CSV files and reports
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('csv-files', 'csv-files', false),
  ('reports', 'reports', false);

-- Storage policies for csv-files bucket
CREATE POLICY "Users can view their own CSV files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'csv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own CSV files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'csv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CSV files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'csv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CSV files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'csv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for reports bucket
CREATE POLICY "Users can view their own reports"
ON storage.objects
FOR SELECT
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own reports"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own reports"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own reports"
ON storage.objects
FOR DELETE
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);
