import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    // First get all employees with their departments and salaries
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        salaries: true
      },
      where: {
        department: {
          isNot: null
        },
        salaries: {
          some: {}
        }
      }
    })

    // Group and calculate averages in JavaScript
    const departmentAverages = employees.reduce((acc, employee) => {
      if (!employee.department || !employee.salaries.length) return acc

      const deptId = employee.department.id
      const deptName = employee.department.name
      
      if (!acc[deptId]) {
        acc[deptId] = {
          name: deptName,
          total: 0,
          count: 0
        }
      }

      employee.salaries.forEach(salary => {
        acc[deptId].total += Number(salary.amount)
        acc[deptId].count += 1
      })

      return acc
    }, {})

    // Format the results
    const formattedAnalysis = Object.values(departmentAverages).map(dept => ({
      name: dept.name,
      average_salary: (dept.total / dept.count).toFixed(2)
    }))

    if (!formattedAnalysis.length) {
      return Response.json([]) // Return empty array if no data
    }

    return Response.json(formattedAnalysis)
  } catch (error) {
    // Fix the error handling
    const errorMessage = error?.message || 'An error occurred during salary analysis'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 