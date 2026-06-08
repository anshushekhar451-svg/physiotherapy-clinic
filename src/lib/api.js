// API utility functions
export const fetchData = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('API Error')
    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('API Error')
    return await response.json()
  } catch (error) {
    console.error('Post error:', error)
    throw error
  }
}

export const updateData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('API Error')
    return await response.json()
  } catch (error) {
    console.error('Update error:', error)
    throw error
  }
}

export const deleteData = async (url) => {
  try {
    const response = await fetch(url, { method: 'DELETE' })
    if (!response.ok) throw new Error('API Error')
    return await response.json()
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}
