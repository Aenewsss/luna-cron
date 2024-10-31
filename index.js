import cron from 'node-cron';
import { sendEmail } from './mailer.js'; // Email function
import { sendWpp } from './whatsapp.js';
import { getData } from './firebase.js'; // Firebase admin setup
import admin from 'firebase-admin'; // Correct import for Firebase Admin SDK

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
function getCronFromFrequence(time, frequence, date) {

    const taskDate = new Date(date)

    switch (frequence) {
        case 'day':
            var day = taskDate.getDate();
            var updatedDate = new Date(taskDate.setDate(day - time))
            return `${updatedDate.getMinutes()} ${updatedDate.getHours()} ${updatedDate.getDate()} ${updatedDate.getMonth() + 1} *`;
        case 'hour':
            var hour = taskDate.getHours();
            var updatedDate = new Date(taskDate.setHours(hour - time))
            return `${updatedDate.getMinutes()} ${updatedDate.getHours()} ${updatedDate.getDate()} ${updatedDate.getMonth() + 1} *`;
        case 'minute':
            var minute = taskDate.getMinutes();
            var updatedDate = new Date(taskDate.setMinutes(minute - time))
            return `${updatedDate.getMinutes()} ${updatedDate.getHours()} ${updatedDate.getDate()} ${updatedDate.getMonth() + 1} *`;
        default:
            throw new Error('Invalid frequency');
    }
}

// Function to schedule cron jobs based on tasks
async function scheduleTasks() {
    clearScheduledJobs(); // Clear previously scheduled jobs

    const tasks = await fetchTasks();

    tasks.forEach((task) => {
        const { title, description, email, notifications, phone, date } = task;

        console.log(`Scheduling task "${title}" to date "${date}"`);

        notifications.forEach(notification => {
            const cronFrequence = getCronFromFrequence(notification.time, notification.frequence, date);

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
        })
    });
}

// Listener to watch for changes in the 'tasks' collection
function watchDatabaseChanges() {
    const tasksRef = admin.database().ref('tasks'); // Correct usage of Firebase Admin SDK

    // Re-run scheduling whenever data changes
    tasksRef.on('value', async () => {
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
