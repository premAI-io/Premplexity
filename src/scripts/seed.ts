import { container } from "tsyringe"

import Configs from "$components/Configs"

const seed = async () => {
  const { env } = container.resolve<Configs>(Configs.token)
}

void (async () => {
  console.log("Seeding...")

  await seed()

  console.log("Done!")
  process.exit(0)
})()
