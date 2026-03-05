import { supabase } from "./supabase";

export const uploadResource = async ({
  title,
  description,
  type,
  price,               // discounted price
  originalPrice,       // MRP
  thumbnail,
  cosmofeed_url,
  userId,
  mapName,
}: any) => {

  if (!cosmofeed_url) {
    throw new Error("CosmoFeed product link is required");
  }

  /* 1️⃣ Upload thumbnail (optional but recommended) */
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

  /* 2️⃣ Save resource in database */
  const { error } = await supabase.from("resources").insert({
    title,
    description,
    type,
    price,
    original_price: originalPrice || price,
    thumbnail_url: thumbnailUrl,
    cosmofeed_url,          // 🔥 MAIN PAYMENT LINK
    created_by: userId,
    map_name: mapName || null,
  });

  if (error) throw error;
};
