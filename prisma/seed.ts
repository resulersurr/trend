import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SeedContent = {
  slug: string;
  tagIds: number[];
  [key: string]: unknown;
};

async function main() {
  await Promise.all([
    prisma.category.upsert({ where: { slug: "etkinlik" }, update: {}, create: { name: "Etkinlik", slug: "etkinlik" } }),
    prisma.category.upsert({ where: { slug: "mekan" }, update: {}, create: { name: "Mekan", slug: "mekan" } }),
    prisma.category.upsert({ where: { slug: "kampanya" }, update: {}, create: { name: "Kampanya", slug: "kampanya" } }),
    prisma.category.upsert({ where: { slug: "rehber" }, update: {}, create: { name: "Rehber", slug: "rehber" } }),
    prisma.category.upsert({ where: { slug: "liste" }, update: {}, create: { name: "Liste", slug: "liste" } }),
  ]);

  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: "populer" }, update: {}, create: { name: "Popüler", slug: "populer" } }),
    prisma.tag.upsert({ where: { slug: "yeni" }, update: {}, create: { name: "Yeni", slug: "yeni" } }),
    prisma.tag.upsert({ where: { slug: "onerilen" }, update: {}, create: { name: "Önerilen", slug: "onerilen" } }),
    prisma.tag.upsert({ where: { slug: "ucretsiz" }, update: {}, create: { name: "Ücretsiz", slug: "ucretsiz" } }),
    prisma.tag.upsert({ where: { slug: "premium" }, update: {}, create: { name: "Premium", slug: "premium" } }),
  ]);

  // mevcut data kodun aynen kalacak 👇
  const data: SeedContent[] = [/* senin data array */];

  for (const c of data) {
    const { tagIds, ...rest } = c;
    await prisma.content.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        ...rest,
        tags: { connect: tagIds.map((i: number) => ({ id: tags[i].id })) },
      },
    });
  }

  await prisma.sponsorBlock.createMany({
    data: [
      { title: "Premium Partner", image: "...", link: "#", position: "home_top", isActive: true },
      { title: "Sponsor Reklam", image: "...", link: "#", position: "home_mid", isActive: true },
      { title: "Detay Sponsor", image: "...", link: "#", position: "detail_sidebar", isActive: true },
    ],
  });

  console.log("Seed completed!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });