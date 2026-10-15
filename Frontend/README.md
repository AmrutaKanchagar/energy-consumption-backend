Smart Energy Consumption & Bill Prediction — Frontend
React + Vite frontend for the AI-Based Smart Energy Consumption and Bill Prediction System. This application provides the user interface for submitting prediction inputs, viewing energy and bill estimates, reviewing prediction history, and managing local settings.
The frontend depends on the Flask backend for ML predictions. Start the backend before testing prediction features.

Features
- Dashboard: Overview cards, charts, and navigation to the main application pages.
- Predict Energy: Enter voltage, current, time/date features, and electricity tariff; submit the inputs to the backend and display the returned prediction.
- Prediction results: Show predicted power, predicted energy for the API's prediction interval, tariff, and estimated bill.
- Monthly estimate: Provides a usage-assumption-based estimate; it is not an actual electricity-provider bill.
- History: Displays predictions saved in browser local storage.
- Settings: Configure tariff and usage assumptions; saved settings synchronize with the prediction form.
- Responsive styling: Shared application styles and page-specific layouts, including dark-mode styling where supported.
Technology
- React
- Vite
- JavaScript / JSX
- CSS
- Fetch/API helper functions in src/services/api.js
- Flask REST API (separate Backend/ folder)
- Browser localStorage for settings and prediction history
Folder structure
Frontend/
├── README.md
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── App.css
    ├── pages/
    │   ├── Predict.jsx
    │   ├── History.jsx
    │   └── Settings.jsx
    └── services/
        └── api.js
This is a simplified map of the main frontend files. Keep any additional components and files already present in your working tree.
Prerequisites
- Node.js and npm
- The repository's Flask backend running locally on port 5000
- Trained model artifacts available to the backend
Setup and run
Run these commands from the repository root in a terminal:
cd Frontend
npm install
npm run dev -- --host 0.0.0.0
Vite usually serves the frontend on port 5173. In GitHub Codespaces, open the forwarded URL for the Vite port from the Ports tab.
Start the backend separately
Open a second terminal from the repository root:
cd Backend
source .venv/bin/activate
python app.py
The commands above use the existing Codespaces virtual environment. For a fresh setup, follow the instructions in the root or backend README and install the dependencies declared by the project.
Backend API connection
The frontend's API helper is located at:
src/services/api.js
The current development setup uses a Vite proxy for /api requests to the Flask server at:
http://127.0.0.1:5000
The backend endpoints used by the application include:
Method	Endpoint	Purpose
GET	/api/health	Check backend availability
GET	/api/models/status	Check trained model availability
POST	/api/predict	Request an energy and bill prediction


If prediction requests fail, check that Flask is running and that vite.config.* proxies /api to the correct backend address. Restart the Vite server after changing proxy settings.
Browser-side settings and history
The current frontend stores settings and prediction history in browser localStorage:
- smartEnergySettings — tariff and usage settings.
- smartEnergyHistory — saved prediction records.
Settings changes are shared between UI components through custom events, including smartEnergySettingsUpdated and smartEnergyHistoryUpdated, where implemented.
This means settings/history are associated with the browser profile and site origin. They are not automatically synced to another device and can be removed when site data is cleared.
Testing checklist
- [ ] Dashboard renders cards, charts, and navigation.
- [ ] Prediction form accepts valid values and displays API results.
- [ ] Empty, negative, and out-of-range inputs are handled appropriately.
- [ ] A new prediction appears in History.
- [ ] History remains after refreshing the browser.
- [ ] Settings remain after refreshing the browser.
- [ ] Changing the tariff in Settings updates the prediction form.
- [ ] The UI shows a readable error when the backend is unavailable.
- [ ] The UI works at a narrow/mobile viewport.
Troubleshooting
Vite does not start
npm install
npm run dev -- --host 0.0.0.0
Read the terminal output for missing packages or syntax errors.
Prediction does not work
1. Check that the Flask backend is running.
2. Test http://127.0.0.1:5000/api/health from the Codespaces terminal.
3. Verify the Vite proxy configuration.
4. Inspect the browser console and backend terminal for errors.
History or settings appear missing
- Use the same browser profile and forwarded URL/origin.
- Check whether browser site data was cleared.
- Inspect localStorage in the browser developer tools.
Layout issue
Check src/App.css and the relevant page component. Avoid replacing unrelated pages when fixing a page-specific styling problem.
Notes and limitations
- The frontend does not train the ML models; it sends inputs to the Flask backend.
- Predictions depend on the trained models and backend response.
- The returned energy/bill values correspond to the API's prediction interval and should not be represented as a full monthly utility bill.
- Monthly estimates depend on usage assumptions and are not official utility charges.
- Browser-local history and settings are not server-side persistent storage.
Related documentation
- Main project overview: [`../README.md`](../README.md)
- Whole-system technical documentation (if present): [`../docs/TECHNICAL_DOCUMENTATION.md`](../docs/TECHNICAL_DOCUMENTATION.md)
- Backend API reference (if present): [`../docs/API_REFERENCE.md`](../docs/API_REFERENCE.md)