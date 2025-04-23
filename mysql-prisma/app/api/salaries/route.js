import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json()
    const salary = await prisma.salary.create({
      data: {
        amount: parseFloat(data.amount),
        employeeId: parseInt(data.employeeId)
      }
    })
    return new Response(JSON.stringify(salary), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 