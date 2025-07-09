import { env } from "@/data/env/server";
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

const webhookSecret = env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Error: Missing Svix headers');
    return new Response('Bad Request: Missing Svix headers', { status: 400 });
  }

  const body = await req.text();

  const sivx = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = sivx.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Bad Request", { status: 400 });
  }

  console.log(event);

  // Rest
  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const email = event.data.email_addresses.find(email => email.id === event.data.primary_email_address_id)?.email_address;
      const name = `${event.data.first_name} ${event.data.last_name}`.trim()
      if (email == null) return new Response("No email", { status: 400 })
      if (name === "") return new Response("No name", { status: 400 })

      if (event.type === "user.created") {
        const user = await insertUser({
          clerkUserId: event.data.id,
          email,
          name,
          imageUrl: event.data.image_url,
          role: 'user',
        })

        await syncClerkUserMetadata(user);
      } else {
        await updateUser({ clerkUserId: event.data.id }, {
          email,
          name,
          imageUrl: event.data.image_url,
          role: event.data.public_metadata.role,
        })
      }
      break
    }
    case "user.deleted": {
      if (event.data.id != null) {
        await deleteUser({ clerkUserId: event.data.id })
      }
      break
    }
  }
  return new Response("the route is working", { status: 200 })
}