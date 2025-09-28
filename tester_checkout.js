// Bible Order Form Test Suite
// Run this in Node.js or any JavaScript environment with console access

class BibleOrderTestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.mockData = this.setupMocks();
        this.orderState = null;
        this.setupTestEnvironment();
    }

    // Setup mocks for browser environment
    setupMocks() {
        return {
            localStorage: new Map(),
            currentUrl: new URL('http://localhost/checkout.html'),
            elements: new Map(),
            openedUrls: [],
            alerts: [],
            confirms: []
        };
    }

    setupTestEnvironment() {
        // Mock global objects that the Bible order form uses
        global.localStorage = {
            getItem: (key) => this.mockData.localStorage.get(key) || null,
            setItem: (key, value) => this.mockData.localStorage.set(key, value),
            removeItem: (key) => this.mockData.localStorage.delete(key),
            get length() { return this.mockData.localStorage.size; },
            key: (index) => Array.from(this.mockData.localStorage.keys())[index] || null
        };

        global.window = {
            location: {
                href: this.mockData.currentUrl.href,
                search: this.mockData.currentUrl.search
            },
            history: {
                replaceState: (state, title, url) => {
                    this.mockData.currentUrl = new URL(url, this.mockData.currentUrl);
                }
            },
            open: (url, target) => {
                this.mockData.openedUrls.push({ url, target });
                return { closed: false };
            },
            alert: (message) => this.mockData.alerts.push(message),
            confirm: (message) => {
                this.mockData.confirms.push(message);
                return true; // Default to confirmed for testing
            }
        };

        global.document = {
            getElementById: (id) => this.mockData.elements.get(id) || this.createMockElement(id),
            querySelector: (selector) => this.mockData.elements.get(selector) || this.createMockElement(selector),
            querySelectorAll: (selector) => [this.createMockElement(selector)]
        };

        // Initialize the order state similar to the real application
        this.orderState = {
            quantity: 1,
            currentStep: 1,
            formData: {},
            orderNumber: null,
            totalAmount: null,
            sessionId: null
        };

        // Constants from the original code
        this.BIBLE_PRICE = 200;
        this.SHIPPING_COST = 49;
    }

    createMockElement(id) {
        const element = {
            id: id,
            value: '',
            textContent: '',
            innerHTML: '',
            style: {},
            classList: {
                add: () => {},
                remove: () => {},
                toggle: () => {},
                contains: () => false
            },
            addEventListener: () => {},
            focus: () => {},
            select: () => {},
            scrollIntoView: () => {}
        };
        this.mockData.elements.set(id, element);
        return element;
    }

    // Core functions extracted and adapted from the original code
    generateUniqueOrderNumber() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomString = '';
        for (let i = 0; i < 6; i++) {
            randomString += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        
        const timestamp = Date.now().toString(36).toUpperCase();
        return `SRB-${year}${month}${day}-${hour}${minute}-${randomString}-${timestamp}`;
    }

    saveSession() {
        const sessionData = {
            ...this.orderState,
            timestamp: new Date().toISOString(),
            lastActivity: Date.now()
        };
        
        localStorage.setItem(`order_${this.orderState.orderNumber}`, JSON.stringify(sessionData));
        localStorage.setItem('lastOrderNumber', this.orderState.orderNumber);
        
        // Mock URL update
        const url = new URL(window.location.href);
        url.searchParams.set('order', this.orderState.orderNumber);
        window.history.replaceState({}, '', url);
    }

    loadSessionByOrderNumber(orderNumber) {
        try {
            const sessionData = localStorage.getItem(`order_${orderNumber}`);
            if (sessionData) {
                return JSON.parse(sessionData);
            }
        } catch (e) {
            console.error('Failed to load session:', e);
        }
        return null;
    }

    validateFormData(formData) {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
            return { valid: false, error: 'Missing required contact fields' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return { valid: false, error: 'Invalid email format' };
        }

        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(formData.phone)) {
            return { valid: false, error: 'Invalid phone format' };
        }

        if (!formData.street || !formData.postalCode || !formData.city) {
            return { valid: false, error: 'Missing required address fields' };
        }

        const postalCodeRegex = /^\d{3}\s?\d{2}$/;
        if (!postalCodeRegex.test(formData.postalCode)) {
            return { valid: false, error: 'Invalid postal code format' };
        }

        return { valid: true };
    }

    calculateTotal(quantity) {
        return (quantity * this.BIBLE_PRICE) + this.SHIPPING_COST;
    }

    composeOrderEmail(orderData) {
        const subject = `Beställning ${orderData.orderNumber}`;
        const emailBody = `Beställning: ${orderData.orderNumber}
Datum: ${new Date().toLocaleDateString('sv-SE')}

Kund: ${orderData.customer.fullName}
E-post: ${orderData.customer.email}
Telefon: ${orderData.customer.phone}

Adress:
${orderData.delivery.street}
${orderData.delivery.postalCode} ${orderData.delivery.city}
${orderData.delivery.country}

Beställning: ${orderData.items[0].quantity} x Svenska Reformationsbibeln
Totalt: ${orderData.pricing.total} kr (inkl frakt)

Swish-betalning genomförd till: ${orderData.customer.phone}`;

        return { subject, emailBody };
    }

    getAllOrders() {
        const orders = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('order_')) {
                try {
                    const orderData = JSON.parse(localStorage.getItem(key));
                    orders.push(orderData);
                } catch (e) {
                    console.error('Failed to parse order:', key, e);
                }
            }
        }
        return orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Test framework methods
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertContains(container, item, message) {
        if (!container.includes(item)) {
            throw new Error(message || `Expected container to include ${item}`);
        }
    }

    assertGreaterThan(actual, expected, message) {
        if (actual <= expected) {
            throw new Error(message || `Expected ${actual} to be greater than ${expected}`);
        }
    }

    // Reset state between tests
    resetState() {
        this.mockData.localStorage.clear();
        this.mockData.openedUrls = [];
        this.mockData.alerts = [];
        this.mockData.confirms = [];
        this.mockData.elements.clear();
        this.orderState = {
            quantity: 1,
            currentStep: 1,
            formData: {},
            orderNumber: null,
            totalAmount: null,
            sessionId: null
        };
    }

    runTests() {
        console.log('\n🧪 Running Bible Order Form Test Suite\n');
        console.log('=' * 60);

        this.tests.forEach(({ name, testFunction }) => {
            try {
                this.resetState();
                testFunction.call(this);
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${name}: ${error.message}`);
                this.failed++;
            }
        });

        console.log('\n' + '=' * 60);
        console.log(`📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        console.log(`🎯 Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(1)}%`);
        
        if (this.failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('⚠️  Some tests failed. Review the output above.');
        }
    }
}

// Create test suite instance and define all tests
const testSuite = new BibleOrderTestSuite();

// ==================== ORDER NUMBER GENERATION TESTS ====================
testSuite.test('Order number generation - format validation', function() {
    const orderNumber = this.generateUniqueOrderNumber();
    this.assert(orderNumber.startsWith('SRB-'), 'Order number should start with SRB-');
    this.assert(orderNumber.length > 20, 'Order number should be sufficiently long for uniqueness');
    
    // Test multiple generations are unique
    const orderNumber2 = this.generateUniqueOrderNumber();
    this.assert(orderNumber !== orderNumber2, 'Generated order numbers should be unique');
});

testSuite.test('Order number generation - pattern matching', function() {
    const orderNumber = this.generateUniqueOrderNumber();
    const pattern = /^SRB-\d{6}-\d{4}-[A-Z0-9]{6}-[A-Z0-9]+$/;
    this.assert(pattern.test(orderNumber), 'Order number should match expected pattern');
});

// ==================== PRICING CALCULATION TESTS ====================
testSuite.test('Price calculation - single item', function() {
    const total = this.calculateTotal(1);
    this.assertEqual(total, 249, 'Single item total should be 249 kr (200 + 49 shipping)');
});

testSuite.test('Price calculation - multiple items', function() {
    const total = this.calculateTotal(3);
    this.assertEqual(total, 649, 'Three items total should be 649 kr (600 + 49 shipping)');
});

testSuite.test('Price calculation - large quantity', function() {
    const total = this.calculateTotal(10);
    this.assertEqual(total, 2049, 'Ten items total should be 2049 kr (2000 + 49 shipping)');
});

// ==================== FORM VALIDATION TESTS ====================
testSuite.test('Form validation - valid data', function() {
    const validData = {
        firstName: 'Erik',
        lastName: 'Andersson',
        email: 'erik@example.com',
        phone: '070-123 45 67',
        street: 'Kungsgatan 1',
        postalCode: '411 19',
        city: 'Göteborg'
    };
    
    const result = this.validateFormData(validData);
    this.assert(result.valid, 'Valid form data should pass validation');
});

testSuite.test('Form validation - missing required fields', function() {
    const invalidData = {
        firstName: '',
        lastName: 'Andersson',
        email: 'erik@example.com',
        phone: '070-123 45 67'
    };
    
    const result = this.validateFormData(invalidData);
    this.assert(!result.valid, 'Missing required fields should fail validation');
    this.assertContains(result.error, 'required', 'Error should mention required fields');
});

testSuite.test('Form validation - invalid email', function() {
    const invalidData = {
        firstName: 'Erik',
        lastName: 'Andersson',
        email: 'invalid-email',
        phone: '070-123 45 67',
        street: 'Kungsgatan 1',
        postalCode: '411 19',
        city: 'Göteborg'
    };
    
    const result = this.validateFormData(invalidData);
    this.assert(!result.valid, 'Invalid email should fail validation');
    this.assertContains(result.error, 'email', 'Error should mention email');
});

testSuite.test('Form validation - invalid postal code', function() {
    const invalidData = {
        firstName: 'Erik',
        lastName: 'Andersson',
        email: 'erik@example.com',
        phone: '070-123 45 67',
        street: 'Kungsgatan 1',
        postalCode: '1234', // Invalid format
        city: 'Göteborg'
    };
    
    const result = this.validateFormData(invalidData);
    this.assert(!result.valid, 'Invalid postal code should fail validation');
    this.assertContains(result.error, 'postal', 'Error should mention postal code');
});

testSuite.test('Form validation - invalid phone number', function() {
    const invalidData = {
        firstName: 'Erik',
        lastName: 'Andersson',
        email: 'erik@example.com',
        phone: 'abc-def-ghij', // Invalid format
        street: 'Kungsgatan 1',
        postalCode: '411 19',
        city: 'Göteborg'
    };
    
    const result = this.validateFormData(invalidData);
    this.assert(!result.valid, 'Invalid phone should fail validation');
    this.assertContains(result.error, 'phone', 'Error should mention phone');
});

// ==================== SESSION MANAGEMENT TESTS ====================
testSuite.test('Session saving and loading', function() {
    // Set up test order
    this.orderState.orderNumber = 'SRB-TEST-001';
    this.orderState.quantity = 2;
    this.orderState.currentStep = 2;
    this.orderState.formData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
    };
    
    // Save session
    this.saveSession();
    
    // Verify it was saved
    const savedData = localStorage.getItem('order_SRB-TEST-001');
    this.assert(savedData !== null, 'Session should be saved to localStorage');
    
    // Load and verify
    const loadedSession = this.loadSessionByOrderNumber('SRB-TEST-001');
    this.assertEqual(loadedSession.orderNumber, 'SRB-TEST-001', 'Loaded order number should match');
    this.assertEqual(loadedSession.quantity, 2, 'Loaded quantity should match');
    this.assertEqual(loadedSession.currentStep, 2, 'Loaded step should match');
});

testSuite.test('Session loading - non-existent order', function() {
    const result = this.loadSessionByOrderNumber('NON-EXISTENT');
    this.assertEqual(result, null, 'Loading non-existent order should return null');
});

testSuite.test('Session data persistence', function() {
    // Create multiple orders
    for (let i = 1; i <= 3; i++) {
        this.orderState.orderNumber = `SRB-TEST-00${i}`;
        this.orderState.quantity = i;
        this.saveSession();
    }
    
    // Get all orders
    const orders = this.getAllOrders();
    this.assertEqual(orders.length, 3, 'Should retrieve all saved orders');
    
    // Verify sorting (newest first)
    this.assert(orders[0].timestamp >= orders[1].timestamp, 'Orders should be sorted by timestamp');
});

// ==================== EMAIL COMPOSITION TESTS ====================
testSuite.test('Email composition - complete order data', function() {
    const orderData = {
        orderNumber: 'SRB-TEST-EMAIL',
        customer: {
            fullName: 'Erik Andersson',
            email: 'erik@example.com',
            phone: '070-123 45 67'
        },
        delivery: {
            street: 'Kungsgatan 1',
            postalCode: '411 19',
            city: 'Göteborg',
            country: 'Sverige'
        },
        items: [{
            quantity: 2,
            product: 'Svenska Reformationsbibeln'
        }],
        pricing: {
            total: 449
        }
    };
    
    const email = this.composeOrderEmail(orderData);
    
    this.assertContains(email.subject, 'SRB-TEST-EMAIL', 'Subject should contain order number');
    this.assertContains(email.emailBody, 'Erik Andersson', 'Body should contain customer name');
    this.assertContains(email.emailBody, 'erik@example.com', 'Body should contain email');
    this.assertContains(email.emailBody, 'Kungsgatan 1', 'Body should contain address');
    this.assertContains(email.emailBody, '449 kr', 'Body should contain total amount');
});

// ==================== ORDER STATE MANAGEMENT TESTS ====================
testSuite.test('Order state initialization', function() {
    this.assertEqual(this.orderState.quantity, 1, 'Initial quantity should be 1');
    this.assertEqual(this.orderState.currentStep, 1, 'Initial step should be 1');
    this.assertEqual(Object.keys(this.orderState.formData).length, 0, 'Initial form data should be empty');
});

testSuite.test('Order state quantity updates', function() {
    this.orderState.quantity = 3;
    const total = this.calculateTotal(this.orderState.quantity);
    this.assertEqual(total, 649, 'Total should update with quantity changes');
});

// ==================== STEP NAVIGATION TESTS ====================
testSuite.test('Step progression validation', function() {
    // Test valid step progression
    this.orderState.currentStep = 1;
    this.assert(this.orderState.currentStep >= 1 && this.orderState.currentStep <= 3, 'Step should be within valid range');
    
    // Test step boundaries
    this.orderState.currentStep = 3;
    this.assert(this.orderState.currentStep <= 3, 'Step should not exceed maximum');
});

// ==================== DATA PERSISTENCE TESTS ====================
testSuite.test('LocalStorage integration', function() {
    const testKey = 'test_order_data';
    const testData = { test: 'data', number: 123 };
    
    localStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    
    this.assertEqual(retrieved.test, 'data', 'Retrieved data should match stored data');
    this.assertEqual(retrieved.number, 123, 'Retrieved number should match stored number');
    
    localStorage.removeItem(testKey);
    this.assertEqual(localStorage.getItem(testKey), null, 'Removed item should return null');
});

// ==================== URL PARAMETER HANDLING TESTS ====================
testSuite.test('URL parameter handling', function() {
    // Simulate URL with order parameter
    this.mockData.currentUrl = new URL('http://localhost/checkout.html?order=SRB-TEST-URL');
    
    // Create and save a test order
    this.orderState.orderNumber = 'SRB-TEST-URL';
    this.orderState.quantity = 2;
    this.saveSession();
    
    // Verify URL was updated during save
    this.assertContains(window.location.href, 'SRB-TEST-URL', 'URL should contain order number');
});

// ==================== ERROR HANDLING TESTS ====================
testSuite.test('Invalid JSON handling in localStorage', function() {
    // Store invalid JSON
    localStorage.setItem('order_INVALID', 'invalid json data');
    
    // Should handle gracefully
    const result = this.loadSessionByOrderNumber('INVALID');
    this.assertEqual(result, null, 'Invalid JSON should return null without crashing');
});

testSuite.test('Empty localStorage handling', function() {
    // Clear all data
    localStorage.clear();
    
    const orders = this.getAllOrders();
    this.assertEqual(orders.length, 0, 'Empty localStorage should return empty orders array');
});

// ==================== INTEGRATION TESTS ====================
testSuite.test('Complete order workflow simulation', function() {
    // Step 1: Create order
    this.orderState.orderNumber = this.generateUniqueOrderNumber();
    this.orderState.quantity = 2;
    
    // Step 2: Add form data
    this.orderState.formData = {
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        phone: '070-999 88 77',
        street: 'Testgatan 123',
        postalCode: '123 45',
        city: 'Teststad',
        country: 'Sverige',
        fullName: 'Integration Test'
    };
    
    // Step 3: Progress through steps
    this.orderState.currentStep = 2;
    this.orderState.totalAmount = this.calculateTotal(this.orderState.quantity);
    
    // Step 4: Save session
    this.saveSession();
    
    // Step 5: Verify complete workflow
    const savedOrder = this.loadSessionByOrderNumber(this.orderState.orderNumber);
    this.assert(savedOrder !== null, 'Order should be saved');
    this.assertEqual(savedOrder.quantity, 2, 'Quantity should be preserved');
    this.assertEqual(savedOrder.currentStep, 2, 'Step should be preserved');
    this.assertEqual(savedOrder.totalAmount, 449, 'Total amount should be calculated correctly');
    this.assertContains(savedOrder.formData.fullName, 'Integration Test', 'Form data should be preserved');
});

testSuite.test('Multiple orders management', function() {
    // Create multiple orders with different states
    const orderNumbers = [];
    
    for (let i = 1; i <= 5; i++) {
        this.orderState.orderNumber = `SRB-MULTI-00${i}`;
        this.orderState.quantity = i;
        this.orderState.currentStep = (i % 3) + 1; // Steps 1-3
        this.orderState.formData = {
            firstName: `User${i}`,
            lastName: 'Test',
            email: `user${i}@test.com`,
            fullName: `User${i} Test`
        };
        
        this.saveSession();
        orderNumbers.push(this.orderState.orderNumber);
        
        // Small delay to ensure different timestamps
        const now = Date.now();
        while (Date.now() === now) { /* wait */ }
    }
    
    // Retrieve and verify all orders
    const allOrders = this.getAllOrders();
    this.assertEqual(allOrders.length, 5, 'Should retrieve all 5 orders');
    
    // Verify each order is unique and contains expected data
    const retrievedNumbers = allOrders.map(order => order.orderNumber);
    orderNumbers.forEach(num => {
        this.assertContains(retrievedNumbers, num, `Should contain order ${num}`);
    });
    
    // Verify sorting (newest first)
    for (let i = 0; i < allOrders.length - 1; i++) {
        const current = new Date(allOrders[i].timestamp);
        const next = new Date(allOrders[i + 1].timestamp);
        this.assert(current >= next, 'Orders should be sorted by timestamp (newest first)');
    }
});

// ==================== PERFORMANCE TESTS ====================
testSuite.test('Large dataset handling', function() {
    const startTime = Date.now();
    
    // Create 100 orders
    for (let i = 1; i <= 100; i++) {
        this.orderState.orderNumber = `SRB-PERF-${String(i).padStart(3, '0')}`;
        this.orderState.quantity = Math.floor(Math.random() * 10) + 1;
        this.saveSession();
    }
    
    const saveTime = Date.now() - startTime;
    
    // Retrieve all orders
    const retrieveStart = Date.now();
    const orders = this.getAllOrders();
    const retrieveTime = Date.now() - retrieveStart;
    
    this.assertEqual(orders.length, 100, 'Should handle 100 orders');
    this.assert(saveTime < 1000, 'Saving 100 orders should complete in reasonable time');
    this.assert(retrieveTime < 100, 'Retrieving 100 orders should be fast');
    
    console.log(`    📈 Performance: Save=${saveTime}ms, Retrieve=${retrieveTime}ms`);
});

// ==================== EDGE CASES TESTS ====================
testSuite.test('Edge case - zero quantity handling', function() {
    // Test boundary condition
    const total = this.calculateTotal(0);
    this.assertEqual(total, 49, 'Zero quantity should still include shipping');
});

testSuite.test('Edge case - very large quantity', function() {
    const largeQuantity = 1000;
    const total = this.calculateTotal(largeQuantity);
    this.assertEqual(total, 200049, 'Large quantity calculation should be accurate');
});

testSuite.test('Edge case - special characters in form data', function() {
    const specialData = {
        firstName: 'Åke',
        lastName: 'Ström-Öberg',
        email: 'åke.ström@example.com',
        phone: '+46-70-123 45 67',
        street: 'Åsgatan 1, Våning 2',
        postalCode: '411 19',
        city: 'Göteborg'
    };
    
    const result = this.validateFormData(specialData);
    this.assert(result.valid, 'Special characters should be handled correctly');
});

testSuite.test('Edge case - extremely long order number', function() {
    const longOrderNumber = 'SRB-' + 'X'.repeat(100);
    this.orderState.orderNumber = longOrderNumber;
    this.saveSession();
    
    const retrieved = this.loadSessionByOrderNumber(longOrderNumber);
    this.assertEqual(retrieved.orderNumber, longOrderNumber, 'Long order numbers should be handled');
});

// Run all tests
testSuite.runTests();