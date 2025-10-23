import { supabase } from "@/integrations/supabase/client";

export interface SavedAnalysis {
  id: string;
  user_id: string;
  name: string;
  analysis_type: string;
  data: any;
  results: any;
  created_at: string;
  updated_at: string;
}

export interface SavedDataset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  data: number[];
  file_url?: string;
  created_at: string;
  updated_at: string;
}

// Analysis operations
export async function saveAnalysis(
  name: string,
  analysisType: string,
  data: any,
  results: any
) {
  const { data: analysis, error } = await (supabase as any)
    .from("saved_analyses")
    .insert({
      name,
      analysis_type: analysisType,
      data,
      results,
    })
    .select()
    .single();

  if (error) throw error;
  return analysis;
}

export async function getUserAnalyses() {
  const { data, error } = await (supabase as any)
    .from("saved_analyses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as SavedAnalysis[];
}

export async function deleteAnalysis(id: string) {
  const { error } = await (supabase as any)
    .from("saved_analyses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Dataset operations
export async function saveDataset(
  name: string,
  data: number[],
  description?: string,
  fileUrl?: string
) {
  const { data: dataset, error } = await (supabase as any)
    .from("saved_datasets")
    .insert({
      name,
      description,
      data,
      file_url: fileUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return dataset;
}

export async function getUserDatasets() {
  const { data, error } = await (supabase as any)
    .from("saved_datasets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as SavedDataset[];
}

export async function deleteDataset(id: string) {
  const { error } = await (supabase as any)
    .from("saved_datasets")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// File upload to storage
export async function uploadCSVFile(file: File, userId: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError, data } = await supabase.storage
    .from("csv-files")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("csv-files")
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function uploadReport(blob: Blob, fileName: string, userId: string) {
  const filePath = `${userId}/${Date.now()}_${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("reports")
    .upload(filePath, blob);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from("reports")
    .getPublicUrl(filePath);

  return publicUrl;
}
