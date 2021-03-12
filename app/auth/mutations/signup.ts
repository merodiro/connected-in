import { resolver, SecurePassword } from 'blitz'
import db from 'db'
import { Signup } from 'app/auth/validations'

export default resolver.pipe(resolver.zod(Signup), async ({ name, email, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password)
  const user = await db.user.create({
    data: { name, email: email.toLowerCase(), hashedPassword, role: 'USER' },
    select: { id: true, name: true, email: true, role: true },
  })

  await ctx.session.$create({ userId: user.id, role: user.role })
  return user
})
