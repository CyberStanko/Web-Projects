import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(request, context) {
  try {
    // Get the amount from the URL params
    const amount = parseFloat(context.params.amount)
    
    if (isNaN(amount)) {
      return Response.json({ error: 'Invalid amount parameter' }, { status: 400 })
    }

    const employees = await prisma.employee.findMany({
      include: {
        salaries: true,
        department: true
      },
      where: {
        salaries: {
          some: {
            amount: {
              lte: amount
            }
          }
        }
      }
    })

    return Response.json(employees)
  } catch (error) {
    console.error('Salary filter error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
} 