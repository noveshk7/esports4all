import { supabase } from "./supabase";

export const uploadResource = async ({
  title,
  description,
  type,
  price,               // ✅ discounted price
  originalPrice,       // ✅ original / MRP
  file,
  thumbnail,
  userId,
  mapName,
}: any) => {

  if (!file) {
    throw new Error("File is required");
  }

  // 1️⃣ Upload main resource file
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  const { error: fileError } = await supabase.storage
    .from("resources")
    .upload(filePath, file);

  if (fileError) throw fileError;

  // 2️⃣ Upload thumbnail (optional)
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

  // 3️⃣ Save resource in database
  const { error } = await supabase.from("resources").insert({
    title,
    description,
    type,
    price,                    // ✅ selling price
    original_price: originalPrice || price, // fallback safety
    file_url: filePath,
    thumbnail_url: thumbnailUrl,
    created_by: userId,
    map_name: mapName,
  });

  if (error) throw error;
};
