import { supabase } from "./supabase";

export const uploadResource = async ({
  title,
  description,
  type,
  price,
  file,
  thumbnail,
  userId,
  mapName,
}: any) => {

  // 1️⃣ Upload file
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  const { error: fileError } = await supabase.storage
    .from("resources")
    .upload(filePath, file);

  if (fileError) throw fileError;

  // 2️⃣ Upload thumbnail
  let thumbnailUrl = "";
  if (thumbnail) {
    const thumbPath = `${Date.now()}-${thumbnail.name}`;
    const { error: thumbError } = await supabase.storage
      .from("thumbnails")
      .upload(thumbPath, thumbnail);

    if (thumbError) throw thumbError;

    const { data } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(thumbPath);

    thumbnailUrl = data.publicUrl;
  }

  // 3️⃣ Save resource in DB
  const { error } = await supabase.from("resources").insert({
  title,
  description,
  type,
  price,
  file_url: filePath,
  thumbnail_url: thumbnailUrl,
  created_by: userId,
  map_name: mapName,
});


  if (error) throw error;
};
