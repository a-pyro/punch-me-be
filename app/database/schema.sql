-- Drop tables if they exist
DROP TABLE IF EXISTS qr_codes CASCADE;
DROP TABLE IF EXISTS user_punchcards CASCADE;
DROP TABLE IF EXISTS punchcards CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Drop ENUM type if it exists
DROP TYPE IF EXISTS user_role;

-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM ('customer', 'store_owner', 'draft');

-- Create users table with avatar URL, phone number, address, date of birth, and verification status
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'draft', -- Use ENUM type for role with default value and NOT NULL constraint
    avatar_url TEXT, -- URL for the user's avatar image
    phone_number VARCHAR(20), -- User's phone number
    address TEXT, -- User's address
    date_of_birth DATE, -- User's date of birth
    is_verified BOOLEAN DEFAULT FALSE, -- Whether the user is verified
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);
-- Create stores table with logo URL, contact email, phone, website URL, and store hours
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT, -- URL for the store's logo image
    address TEXT, -- Store's physical address
    contact_email VARCHAR(255), -- Contact email for the store
    contact_phone VARCHAR(20), -- Contact phone for the store
    website_url TEXT, -- URL to the store’s website
    store_hours JSONB, -- JSON for store hours
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create punchcards table with image URL, description, expiration date, and terms & conditions
CREATE TABLE punchcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    total_punches INT NOT NULL DEFAULT 0,
    punches_needed INT NOT NULL DEFAULT 10,
    image_url TEXT, -- URL for the punchcard image
    description TEXT, -- Description of the punchcard
    expiration_date DATE, -- Expiration date of the punchcard
    terms_conditions TEXT, -- Terms and conditions for the punchcard
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create user_punchcards table
CREATE TABLE user_punchcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    punchcard_id UUID NOT NULL REFERENCES punchcards(id) ON DELETE CASCADE,
    punches INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create qr_codes table with additional attributes if needed
CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    punchcard_id UUID NOT NULL REFERENCES punchcards(id) ON DELETE CASCADE,
    qr_code_data TEXT NOT NULL, -- This could be a URL or encoded data for the QR code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    punchcard_id UUID NOT NULL REFERENCES punchcards(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    description TEXT
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    punchcard_id UUID REFERENCES punchcards(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);
