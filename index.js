import cron from 'node-cron';
import { sendEmail } from './mailer.js'; // Email function
import { sendWpp } from './whatsapp.js';
import { getData, database } from './firebase.js'; // Import Firebase database reference
import { ref, onValue } from 'firebase-admin/database'; // Firebase listener functions

let scheduledJobs = [];

// Function to fetch tasks from the database
async function fetchTasks() {
    return await getData('tasks');
}

// Helper function to clear previously scheduled tasks
function clearScheduledJobs() {
    scheduledJobs.forEach((job) => job.stop());
    scheduledJobs = [];
}

// Function to get cron expression based on the frequency
function getCronFromFrequence(time, frequence, createdAt) {
    const hour = new Date(createdAt).getHours();
    const minute = new Date(createdAt).getMinutes();

    switch (frequence) {
        case 'day':
            return `${minute} ${hour} */${time} * *`; // Every X days at the given hour/minute
        case 'hour':
            return `${minute} */${time} * * *`; // Every X hours at the given minute
        case 'minute':
            return `*/${time} * * * *`; // Every X minutes
        default:
            throw new Error('Invalid frequency');
    }
}

// Function to schedule cron jobs based on tasks
async function scheduleTasks() {
    clearScheduledJobs(); // Clear previously scheduled jobs

    const tasks = await fetchTasks();

    tasks.forEach((task) => {
        const { title, description, frequence, email, phone, time, createdAt } = Object.values(task)[0];

        console.log(`Scheduling task "${title}" with frequence "${frequence}"`);

        const cronFrequence = getCronFromFrequence(time, frequence, createdAt);

        const job = cron.schedule(cronFrequence, async () => {
            console.log(`Executing task "${title}"`);

            // Send email to the user
            await sendEmail(email, `Reminder: ${title}`, `You have a task: ${description}`);
            console.log('Email sent');

            // Send WhatsApp message
            await sendWpp(phone, `Lembrete: ${title}`, description);
            console.log('WhatsApp message sent');
        });

        scheduledJobs.push(job); // Store the scheduled job
    });
}

// Listener to watch for changes in the 'tasks' collection
function watchDatabaseChanges() {
    const tasksRef = ref(database, 'tasks');

    // Re-run scheduling whenever data changes
    onValue(tasksRef, async () => {
        console.log('Detected changes in tasks. Re-scheduling...');
        await scheduleTasks();
    });
}

// Start the cron jobs when the app is first run
async function startCronJobs() {
    console.log('Starting cron jobs for the first time...');
    await scheduleTasks(); // Schedule tasks on the first run
    watchDatabaseChanges(); // Watch for future changes
}

// Initialize the process
startCronJobs();