const axios = require('axios');

/**
 * Service to handle Meta (Facebook & Instagram) Lead Generation API calls
 */
class MetaLeadService {
    constructor() {
        this.token = process.env.WHATSAPP_TOKEN; // Reusing the same token if possible, or process.env.META_ACCESS_TOKEN
        this.apiVersion = 'v22.0';
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    }

    /**
     * Fetch lead details from Meta Graph API using lead_id
     * @param {string} leadId - The ID of the lead from the webhook
     * @returns {Promise<Object>} The lead details (name, email, phone, etc.)
     */
    async getLeadDetails(leadId) {
        if (!this.token) {
            throw new Error('Meta Access Token not configured');
        }

        const url = `${this.baseUrl}/${leadId}`;

        try {
            const response = await axios.get(url, {
                params: {
                    access_token: this.token
                }
            });

            console.log(`✅ Meta lead details fetched for ID: ${leadId}`);
            
            // Meta returns field_data as an array of {name, values}
            const fieldData = response.data.field_data || [];
            const leadInfo = {
                lead_id: leadId,
                created_time: response.data.created_time,
                platform: response.data.platform, // 'fb' or 'ig'
            };

            // Parse field data into a flat object
            fieldData.forEach(field => {
                const name = field.name;
                const value = field.values?.[0];
                
                if (name === 'full_name' || name === 'name') leadInfo.name = value;
                if (name === 'email') leadInfo.email = value;
                if (name === 'phone_number' || name === 'phone') leadInfo.phone = value;
                
                // Add any other fields as metadata
                leadInfo[name] = value;
            });

            return leadInfo;
        } catch (error) {
            console.error('❌ Failed to fetch Meta lead details:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Get platform name for CRM source
     * @param {string} platform - 'fb' or 'ig'
     * @returns {string} 'Facebook' or 'Instagram'
     */
    getSourceFromPlatform(platform) {
        if (platform === 'ig') return 'Instagram';
        return 'Facebook';
    }
}

module.exports = new MetaLeadService();
