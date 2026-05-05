// ============================================
// BIGISUB API CONFIGURATION
// Direct call to api.bigisub.ng (CORS-enabled)
// ============================================

const BIGISUB_CONFIG = {
    TOKEN: 'ed27cc939ed9475a3b7e6c3ade328d72fa956ad6',
    BASE_URL: 'https://api.bigisub.ng/api/v2/',
    PIN_CODE: '2010',
    PROFIT_MARGIN: 50 // your markup in NGN
};

// Endpoint catalogue (Bigisub v2)
const BIGISUB_ENDPOINTS = {
    DATA_PLANS:        'vtu/data/plans/',
    DATA_PURCHASE:     'vtu/data/purchase/',
    AIRTIME_PURCHASE:  'vtu/airtime/purchase/',
    CABLE_PRICING:     'vtu/cable/pricing/',
    CABLE_PLANS:       'vtu/cable/plans/',
    CABLE_VERIFY:      'vtu/cable/verify/',
    CABLE_PURCHASE:    'vtu/cable/purchase/',
    ELECTRIC_PROVIDERS:'bills/electricity/providers/',
    ELECTRIC_VERIFY:   'bills/electricity/verify/',
    ELECTRIC_PAY:      'bills/electricity/pay/'
};

const NETWORKS = [
    { id: 'mtn',     name: 'MTN',     networkId: 1, image: 'assets/networks/mtn-logo.png' },
    { id: 'glo',     name: 'GLO',     networkId: 2, image: 'assets/networks/glo-logo.png' },
    { id: 'airtel',  name: 'AIRTEL',  networkId: 3, image: 'assets/networks/airtel-logo.jpeg' },
    { id: '9mobile', name: '9MOBILE', networkId: 4, image: 'assets/networks/9mobile-logo.jpeg' }
];

async function bigisubRequest(endpoint, method = 'GET', data = null) {
    const path = endpoint.replace(/^\//, '');
    const url = BIGISUB_CONFIG.BASE_URL + path;

    const options = {
        method,
        headers: {
            'Authorization': `Token ${BIGISUB_CONFIG.TOKEN}`,
            'Accept': 'application/json'
        }
    };
    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const text = await response.text();
        try {
            const json = JSON.parse(text);
            if (typeof json.success === 'undefined') json.success = response.ok;
            return json;
        } catch {
            return { success: false, message: text || `HTTP ${response.status}` };
        }
    } catch (error) {
        console.error('Bigisub API Error:', error);
        return { success: false, message: 'Network error. Please check your internet and try again.' };
    }
}

function withMargin(amount) {
    return Math.ceil(Number(amount || 0)) + BIGISUB_CONFIG.PROFIT_MARGIN;
}
function fmt(n) { return '₦' + Number(n || 0).toLocaleString(); }
