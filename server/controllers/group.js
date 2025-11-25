import { supabase } from "../config/supabase.js";

// Get all groups
export const getGroups = async (req, res) => {
  try {
    const { data, error } = await supabase.from("group").select("*");

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get group by ID
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("group")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create group
export const createGroup = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("group")
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update group
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("group")
      .update(req.body)
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("group").delete().eq("id", id);

    if (error) throw error;
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
