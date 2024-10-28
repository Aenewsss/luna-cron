// cronJobs.js
import cron from 'node-cron';
import { sendEmail } from '../mailer.js'; // Email function
import { sendWpp } from '../whatsapp.js';
import { getData } from "../firebase.js"

// Function to fetch tasks from the database
async function fetchTasks() {
    return await getData('tasks')
}

function getCronFromFrequence(time, frequence, createdAt) {
    const hour = new Date(createdAt).getHours()
    const minute = new Date(createdAt).getMinutes()

    switch (frequence) {
        case 'day': return `${minute} ${hour} */${time} * *`
        case 'hour': return `${minute} */${time} * * *`
        case 'minute': return `*/${time} * * * *`
    }
}

// Function to schedule cron jobs based on the frequence
function scheduleTasks() {
    const tasks = await fetchTasks();

    tasks.forEach((task) => {
        const { title, description, frequence, email, phone, time, createdAt } = Object.values(task)[0];

        console.log(`Scheduling task "${title}" with frequence "${frequence}"`);

        const cronFrequence = getCronFromFrequence(time, frequence, createdAt)

        cron.schedule(cronFrequence, async () => {
            console.log(`Executing task "${title}"`);

            // Send email to the user
            await sendEmail(
                email,
                `Reminder: ${title}`,
                `You have a task: ${description}`
            );
            console.log('Email sent')

            // Send whatsapp to the user
            await sendWpp(
                phone,
                `Lembrete: ${title}`,
                description
            );
            console.log('Wpp message sent')

        });
    });
}

scheduleTasks();