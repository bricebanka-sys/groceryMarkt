import { createGroceryItem, listGroceryItems } from "@/lib/server/db-actions";

// 1. REQUÊTE GET : Récupérer tous les articles de la base de données
export async function GET() {
  try {
    const items = await listGroceryItems();
    return Response.json({ items });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fecht items";
    return Response.json({ error: message }, { status: 500 });
  }
}

// 2. REQUÊTE POST : Créer un nouvel article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, quantity, priority } = body;

    // Validation des champs obligatoires
    if (!name || !category || !priority) {
      return Response.json(
        { error: "Please provide all required fields." },
        { status: 400 },
      );
    }

    const newItem = await createGroceryItem({
      name,
      category,
      quantity: quantity || 1,
      priority,
    });

    return Response.json(newItem, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create item";
    return Response.json({ error: message }, { status: 500 });
  }
}
