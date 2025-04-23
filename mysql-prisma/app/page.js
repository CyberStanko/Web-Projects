'use client'
import { useState, useEffect } from 'react'
import Image from "next/image";

export default function Home() {
  const [activeTab, setActiveTab] = useState('add')
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [salaryAnalysis, setSalaryAnalysis] = useState([])
  const [salaryFilter, setSalaryFilter] = useState(60000)
  const [showSalaryFilter, setShowSalaryFilter] = useState(false)
  
  // Form states
  const [newDepartment, setNewDepartment] = useState({ name: '' })
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    departmentId: ''
  })
  const [newSalary, setNewSalary] = useState({
    employeeId: '',
    amount: ''
  })

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch departments')
        }
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error('Error fetching departments:', error.message)
        setDepartments([])
      }
    }
    fetchDepartments()
  }, [])

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch employees')
        }
        const data = await response.json()
        setEmployees(data)
      } catch (error) {
        console.error('Error fetching employees:', error.message)
        setEmployees([])
      }
    }
    fetchEmployees()
  }, [])

  // Fetch salary analysis
  useEffect(() => {
    const fetchSalaryAnalysis = async () => {
      try {
        const response = await fetch('/api/salary-analysis')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch salary analysis')
        }
        const data = await response.json()
        setSalaryAnalysis(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching salary analysis:', error.message)
        setSalaryAnalysis([])
      }
    }
    fetchSalaryAnalysis()
  }, [])

  // Handle form submissions
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!newDepartment.name || newDepartment.name.trim() === '') {
        alert('Please enter a department name')
        return
      }

      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDepartment.name.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add department')
      }

      // Clear the form
      setNewDepartment({ name: '' })
      
      // Refresh the departments list
      const deptResponse = await fetch('/api/departments')
      const updatedDepts = await deptResponse.json()
      setDepartments(updatedDepts)
      
      // Show success message
      alert('Department added successfully!')
    } catch (error) {
      console.error('Error adding department:', error)
      alert(error.message || 'Failed to add department')
    }
  }

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add employee')
      }
      
      setNewEmployee({ name: '', departmentId: '' })
      // Refresh employees list
      const empResponse = await fetch('/api/employees')
      const updatedEmps = await empResponse.json()
      setEmployees(updatedEmps)
    } catch (error) {
      console.error('Error adding employee:', error)
      alert('Failed to add employee: ' + error.message)
    }
  }

  const handleSalarySubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSalary)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add salary')
      }
      
      setNewSalary({ employeeId: '', amount: '' })
      // Refresh employees list to show updated salary
      const empResponse = await fetch('/api/employees')
      const updatedEmps = await empResponse.json()
      setEmployees(updatedEmps)
      
      // Refresh salary analysis
      const analysisResponse = await fetch('/api/salary-analysis')
      const updatedAnalysis = await analysisResponse.json()
      setSalaryAnalysis(updatedAnalysis)
    } catch (error) {
      console.error('Error adding salary:', error)
      alert('Failed to add salary: ' + error.message)
    }
  }

  const handleSalaryFilterChange = async (amount) => {
    try {
      const response = await fetch(`/api/employees/salary-filter/${amount}`)
      const data = await response.json()
      setFilteredEmployees(data)
    } catch (error) {
      console.error('Error fetching filtered employees:', error)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-indigo-800">Employee Management System</h1>
      
      <div className="flex gap-4 mb-8">
        <button 
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'add' 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add Data
        </button>
        <button 
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'view' 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('view')}
        >
          View Data
        </button>
      </div>

      {activeTab === 'add' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Department Form */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Add Department</h2>
            <form onSubmit={handleDepartmentSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Department Name</label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                Add Department
              </button>
            </form>
          </div>

          {/* Add Employee Form */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Add Employee</h2>
            <form onSubmit={handleEmployeeSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Employee Name</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Department</label>
                <select
                  value={newEmployee.departmentId}
                  onChange={(e) => setNewEmployee({ ...newEmployee, departmentId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                Add Employee
              </button>
            </form>
          </div>

          {/* Add Salary Form */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Add Salary</h2>
            <form onSubmit={handleSalarySubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Employee</label>
                <select
                  value={newSalary.employeeId}
                  onChange={(e) => setNewSalary({ ...newSalary, employeeId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Salary Amount</label>
                <input
                  type="number"
                  value={newSalary.amount}
                  onChange={(e) => setNewSalary({ ...newSalary, amount: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                Add Salary
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="grid grid-cols-1 gap-8">
          {/* Departments Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Departments</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="p-2 text-left text-indigo-800">ID</th>
                  <th className="p-2 text-left text-indigo-800">Name</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => (
                  <tr key={dept.id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-gray-800">{dept.id}</td>
                    <td className="p-2 text-gray-800">{dept.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Employees</h2>
            <div className="mb-4">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={showSalaryFilter}
                  onChange={(e) => setShowSalaryFilter(e.target.checked)}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                />
                Filter by Salary
              </label>
              {showSalaryFilter && (
                <div className="mt-2">
                  <input
                    type="number"
                    value={salaryFilter}
                    onChange={(e) => {
                      setSalaryFilter(e.target.value)
                      handleSalaryFilterChange(e.target.value)
                    }}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter maximum salary"
                  />
                </div>
              )}
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="p-2 text-left text-indigo-800">ID</th>
                  <th className="p-2 text-left text-indigo-800">Name</th>
                  <th className="p-2 text-left text-indigo-800">Department</th>
                  <th className="p-2 text-left text-indigo-800">Salary</th>
                </tr>
              </thead>
              <tbody>
                {(showSalaryFilter ? filteredEmployees : employees).map(emp => (
                  <tr key={emp.id} className="border-t hover:bg-gray-50">
                    <td className="p-2 text-gray-800">{emp.id}</td>
                    <td className="p-2 text-gray-800">{emp.name}</td>
                    <td className="p-2 text-gray-800">
                      {departments.find(d => d.id === emp.departmentId)?.name}
                    </td>
                    <td className="p-2 text-gray-800">
                      {emp.salaries?.[0]?.amount ? 
                        `Rs. ${emp.salaries[0].amount.toLocaleString()}` : 
                        'No salary data'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Salary Analysis Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Department Salary Analysis</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="p-2 text-left text-indigo-800">Department</th>
                  <th className="p-2 text-left text-indigo-800">Average Salary</th>
                </tr>
              </thead>
              <tbody>
                {salaryAnalysis.length > 0 ? (
                  salaryAnalysis.map(dept => (
                    <tr key={dept.name} className="border-t hover:bg-gray-50">
                      <td className="p-2 text-gray-800">{dept.name}</td>
                      <td className="p-2 text-gray-800">
                        Rs. {Number(dept.average_salary).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-2 text-center text-gray-600">
                      No salary data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
