import prisma from '@/lib/db'

export async function GET() {
  try {
    const departments = await prisma.department.findMany()
    return Response.json(departments)
  } catch (error) {
    console.error('Database error:', error)
    const errorMessage = error?.message || 'An error occurred while fetching departments'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validate input
    if (!data.name || data.name.trim() === '') {
      return Response.json(
        { error: 'Department name is required' },
        { status: 400 }
      )
    }

    const department = await prisma.department.create({
      data: {
        name: data.name.trim()
      }
    })

    return Response.json(department, { status: 201 })
  } catch (error) {
    console.error('Department creation error:', error)
    return Response.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
} 