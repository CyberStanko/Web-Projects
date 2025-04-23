import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        salaries: true
      }
    })
    return Response.json(employees)
  } catch (error) {
    const errorMessage = error?.message || 'An error occurred while fetching employees'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        departmentId: parseInt(data.departmentId)
      },
      include: {
        department: true,
        salaries: true
      }
    })
    return new Response(JSON.stringify(employee), {
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