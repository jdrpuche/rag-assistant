const API_BASE = '/api';

document.getElementById('upload-btn').addEventListener('click', async () => {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  if (!file) return alert('Selecciona un archivo');
  
  if (file.size > 50 * 1024 * 1024) {
    return alert('Archivo muy grande. Máximo 50MB.');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    console.log('Uploading file:', file.name, 'size:', file.size);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutos timeout
    
    const response = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Upload response status:', response.status);
    const result = await response.json();
    console.log('Upload response body:', result);
    
    if (!response.ok) {
      throw new Error(result.error || `Server error: ${response.status}`);
    }
    
    alert(result.message);
    fileInput.value = '';
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Upload timeout: backend took too long');
      alert('Timeout: El servidor tardó demasiado. Intenta con un PDF más pequeño.');
    } else {
      console.error('Upload error:', error);
      alert('Error uploading file: ' + error.message);
    }
  }
});

document.getElementById('ask-btn').addEventListener('click', async () => {
  const questionInput = document.getElementById('question-input');
  const question = questionInput.value.trim();
  if (!question) return;
  addMessage('user', question);
  questionInput.value = '';
  try {
    const response = await fetch(`${API_BASE}/questions/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const result = await response.json();
    addMessage('assistant', result.answer);
  } catch (error) {
    addMessage('assistant', 'Error al obtener respuesta');
  }
});

function addMessage(sender, text) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}