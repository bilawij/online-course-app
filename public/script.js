document.addEventListener('DOMContentLoaded', () => {
    const courseForm = document.getElementById('courseForm');
    const coursesList = document.getElementById('courses');

    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('courseTitle').value;
        const description = document.getElementById('courseDescription').value;
        const duration = document.getElementById('courseDuration').value;

        await fetch('/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, duration })
        });

        loadCourses();
    });

    async function loadCourses() {
        const response = await fetch('/courses');
        const courses = await response.json();
        coursesList.innerHTML = '';
        courses.forEach(course => {
            const li = document.createElement('li');
            li.textContent = `${course.title} - ${course.description} - ${course.duration}`;

            // Update button
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => {
                const newTitle = prompt('New Title:', course.title);
                const newDescription = prompt('New Description:', course.description);
                const newDuration = prompt('New Duration:', course.duration);
                if (newTitle && newDescription && newDuration) {
                    fetch(`/courses/${course.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: newTitle, description: newDescription, duration: newDuration })
                    }).then(loadCourses);
                }
            });

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                fetch(`/courses/${course.id}`, {
                    method: 'DELETE'
                }).then(loadCourses);
            });

            li.appendChild(updateButton);
            li.appendChild(deleteButton);
            coursesList.appendChild(li);
        });
    }

    loadCourses();
});

