# Plaid Modal Troubleshooting Guide

## Issue: Plaid Modal Appears But Is Not Clickable

If the Plaid modal appears when you click "Connect Your Bank Account" but you cannot interact with it, follow these troubleshooting steps:

### 1. Check Browser Console for Errors

Open your browser's developer tools (F12) and check the Console tab for any JavaScript errors. Common issues include:

- **CORS errors**: Backend not running or wrong URL
- **Network errors**: API endpoint not responding
- **Script loading errors**: Plaid script not loaded properly

### 2. Verify Backend Setup

Ensure your backend is properly configured:

1. **Check if backend is running**:
   ```bash
   cd GreenTruth-Backend
   npm start
   ```

2. **Verify Plaid credentials** in your `.env` file:
   ```
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   ```

3. **Test the API endpoint**:
   ```bash
   curl -X POST http://localhost:5000/api/plaid/create-link-token \
     -H "Content-Type: application/json" \
     -d '{"userId":"test","userName":"Test User"}'
   ```

### 3. Check Frontend Configuration

1. **Verify API URL** in `src/config/api.ts`:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL;
   ```

2. **Check environment variables** in your frontend `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

### 4. Test with Debug Components

Use the debug components we created:

1. Navigate to `/plaid-test` in your application
2. Check if Plaid script is loaded
3. Try fetching a link token manually
4. Monitor the debug log for errors

### 5. Common Solutions

#### Issue: Modal appears but is frozen
**Solution**: Check if there are any CSS z-index conflicts or if the modal is being blocked by other elements.

#### Issue: "Plaid script not loaded" error
**Solution**: 
1. Check if the script tag is present in `index.html`
2. Ensure the script loads before the React app
3. Try adding the script dynamically if needed

#### Issue: "Link token not received" error
**Solution**:
1. Check backend logs for Plaid API errors
2. Verify Plaid credentials are correct
3. Ensure you're using sandbox credentials for testing

#### Issue: CORS errors
**Solution**:
1. Ensure backend CORS is properly configured
2. Check that the API URL is correct
3. Verify the backend is running on the expected port

### 6. Alternative Debugging Steps

1. **Test with a simple Plaid Link**:
   ```javascript
   const { open, ready } = usePlaidLink({
     token: 'link-sandbox-xxx', // Use a test token
     onSuccess: (publicToken, metadata) => {
       console.log('Success:', publicToken);
     },
   });
   ```

2. **Check network tab** for failed requests

3. **Verify Plaid dashboard** settings match your configuration

### 7. Environment-Specific Issues

#### Development Environment
- Use sandbox credentials
- Ensure localhost URLs are correct
- Check for port conflicts

#### Production Environment
- Use production Plaid credentials
- Verify domain whitelist in Plaid dashboard
- Check SSL certificate issues

### 8. Getting Help

If the issue persists:

1. Check the browser console for specific error messages
2. Look at the debug log in the test page
3. Verify all environment variables are set correctly
4. Test with the Plaid sandbox credentials

### 9. Quick Fix Checklist

- [ ] Backend is running on port 5000
- [ ] Plaid credentials are set in backend .env
- [ ] Frontend API_URL is correct
- [ ] No JavaScript errors in browser console
- [ ] Plaid script is loaded (check /plaid-test page)
- [ ] Link token is being received successfully
- [ ] No CSS conflicts blocking the modal

### 10. Test Credentials

For testing, you can use these Plaid sandbox credentials:
- Username: `user_good`
- Password: `pass_good`

These will work with any Plaid sandbox integration. 