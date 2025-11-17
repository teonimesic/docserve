import { useState } from 'react'

interface TodoCheckboxProps {
  checked: boolean
  index: number
  filePath: string
}

export function TodoCheckbox({ checked: initialChecked, index, filePath }: TodoCheckboxProps) {
  const [checked, setChecked] = useState(initialChecked)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    const newChecked = !checked
    setChecked(newChecked)
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/todos/${filePath}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkbox_index: index,
          checked: newChecked,
        }),
      })

      if (!response.ok) {
        // Revert on error
        setChecked(!newChecked)
        console.error('Failed to update todo')
      }
    } catch (error) {
      // Revert on error
      setChecked(!newChecked)
      console.error('Failed to update todo:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleToggle}
      disabled={isUpdating}
      className="todo-checkbox"
    />
  )
}
