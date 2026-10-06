const express = require('express');
const path = require('path');

// ========================================
// Task 1 - Create Express App
// ========================================
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// Task 2 - Serve Static Files
// ========================================
// index: false so that GET / is handled by the route handler below
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// ========================================
// BONUS: Custom Request Logging Middleware
// ========================================
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ========================================
// Task 3 - Route Handlers
// ========================================
// Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Contact page route
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// ========================================
// Task 4 + BONUS Task 6 - API Endpoints with Express Router
// ========================================
const apiRouter = express.Router();

// GET /api/time -> current date/time as JSON
apiRouter.get('/time', (req, res) => {
    res.json({
        datetime: new Date().toISOString(),
        timestamp: Date.now()
    });
});

// GET /api/info -> server information
apiRouter.get('/info', (req, res) => {
    res.json({
        name: 'Workshop03 Express Server',
        version: '1.0.0',
        nodeVersion: process.version,
        expressVersion: require('express/package.json').version
    });
});

// GET /api/status -> server status
apiRouter.get('/status', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    });
});

// GET /api/error -> deliberately throws to test the 500 handler
apiRouter.get('/error', (req, res, next) => {
    next(new Error('Test error for the 500 handler'));
});

// Mount the API router
app.use('/api', apiRouter);

// ========================================
// Task 5 - Error Handling Middleware
// ========================================

// 404 Handler - placed AFTER all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'), (err) => {
        if (err) {
            res.status(404).type('text/plain').send('404 - Page Not Found');
        }
    });
});

// 500 Error Handler - placed LAST
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).sendFile(path.join(__dirname, 'public', '500.html'), (sendErr) => {
        if (sendErr) {
            res.status(500).type('text/plain').send('500 - Internal Server Error');
        }
    });
});

// ========================================
// Start the Server
// ========================================
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log('\n📍 Available routes:');
    console.log('  GET /              -> Home page');
    console.log('  GET /about         -> About page');
    console.log('  GET /contact       -> Contact page');
    console.log('  GET /api/time      -> Current date/time API');
    console.log('  GET /api/info      -> Server information API');
    console.log('  GET /api/status    -> Server status API');
    console.log('  GET /api/error     -> Test the 500 error handler');
    console.log('\n⏹️  Press Ctrl+C to stop the server\n');
});
