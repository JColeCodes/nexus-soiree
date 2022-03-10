module.exports = (
    timestamp => {
        return new Date(timestamp).toLocaleString('en-US', { 
            hourCycle: 'h12',
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    }
);