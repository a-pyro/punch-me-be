-- Drop tables if they exist
DROP TABLE IF EXISTS qr_codes CASCADE;

DROP TABLE IF EXISTS user_punchcards CASCADE;

DROP TABLE IF EXISTS punchcards CASCADE;

DROP TABLE IF EXISTS stores CASCADE;

DROP TABLE IF EXISTS profiles CASCADE;

DROP TABLE IF EXISTS transactions CASCADE;

DROP TABLE IF EXISTS notifications CASCADE;

DROP TABLE IF EXISTS reviews CASCADE;

DROP TABLE IF EXISTS profiles CASCADE;

-- Drop ENUM type if it exists
DROP TYPE IF EXISTS user_role CASCADE;

-- Create ENUM type for user roles
CREATE TYPE user_role AS ENUM ('customer', 'store_owner', 'draft');

-- Enable MODDATETIME extension for handling updated_at column
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

----------------------------------------------------------------------
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  role user_role not null default 'draft',
  phone_number text,
  address text,
  full_name text,
  date_of_birth date,
  avatar_url text,
  updated_at timestamp
  with
    time zone,
    created_at timestamp
  with
    time zone default current_timestamp,
    primary key (id)
);

-- Enable RLS on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own profiles
CREATE POLICY select_own_profile ON profiles FOR
SELECT
  USING (auth.uid () = id);

-- Allow users to update their own profiles
CREATE POLICY update_own_profile ON profiles FOR
UPDATE USING (auth.uid () = id);

-- Allow users to insert their own profile
CREATE POLICY insert_own_profile ON profiles FOR INSERT
WITH
  CHECK (auth.uid () = id);

-- Allow users to delete their own profiles
CREATE POLICY delete_own_profile ON profiles FOR DELETE USING (auth.uid () = id);

----------------------------------------------------------------------
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  address TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website_url TEXT,
  store_hours JSONB,
  created_at TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP
  WITH
    TIME ZONE
);

-- Enable RLS on the stores table
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Allow store owners to select their stores
CREATE POLICY select_own_store ON stores FOR
SELECT
  USING (auth.uid () = user_id);

-- Allow store owners to insert a store
CREATE POLICY insert_store ON stores FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

-- Allow store owners to update their stores
CREATE POLICY update_own_store ON stores FOR
UPDATE USING (auth.uid () = user_id);

-- Allow store owners to delete their stores
CREATE POLICY delete_own_store ON stores FOR DELETE USING (auth.uid () = user_id);

----------------------------------------------------------------------
CREATE TABLE punchcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  store_id UUID NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  total_punches INT NOT NULL DEFAULT 0,
  punches_needed INT NOT NULL DEFAULT 10,
  image_url TEXT,
  description TEXT,
  expiration_date DATE,
  terms_conditions TEXT,
  created_at TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP
  WITH
    TIME ZONE
);

-- Enable RLS on the punchcards table
ALTER TABLE punchcards ENABLE ROW LEVEL SECURITY;

-- Allow store owners to select punchcards for their stores
CREATE POLICY select_store_punchcards ON punchcards FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        stores
      WHERE
        stores.id = punchcards.store_id
        AND auth.uid () = stores.user_id
    )
  );

-- Allow store owners to insert punchcards for their stores
CREATE POLICY insert_store_punchcards ON punchcards FOR INSERT
WITH
  CHECK (
    EXISTS (
      SELECT
        1
      FROM
        stores
      WHERE
        stores.id = punchcards.store_id
        AND auth.uid () = stores.user_id
    )
  );

-- Allow store owners to update punchcards for their stores
CREATE POLICY update_store_punchcards ON punchcards FOR
UPDATE USING (
  EXISTS (
    SELECT
      1
    FROM
      stores
    WHERE
      stores.id = punchcards.store_id
      AND auth.uid () = stores.user_id
  )
);

-- Allow store owners to delete punchcards for their stores
CREATE POLICY delete_store_punchcards ON punchcards FOR DELETE USING (
  EXISTS (
    SELECT
      1
    FROM
      stores
    WHERE
      stores.id = punchcards.store_id
      AND auth.uid () = stores.user_id
  )
);

----------------------------------------------------------------------
CREATE TABLE user_punchcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  punchcard_id UUID NOT NULL REFERENCES punchcards (id) ON DELETE CASCADE,
  punches INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP
  WITH
    TIME ZONE
);

-- Enable RLS on the user_punchcards table
ALTER TABLE user_punchcards ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own punchcards
CREATE POLICY select_own_punchcards ON user_punchcards FOR
SELECT
  USING (auth.uid () = user_id);

-- Allow users to insert a punchcard for themselves
CREATE POLICY insert_own_punchcards ON user_punchcards FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

-- Allow users to update their own punchcards
CREATE POLICY update_own_punchcards ON user_punchcards FOR
UPDATE USING (auth.uid () = user_id);

-- Allow users to delete their own punchcards
CREATE POLICY delete_own_punchcards ON user_punchcards FOR DELETE USING (auth.uid () = user_id);

----------------------------------------------------------------------
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  punchcard_id UUID NOT NULL REFERENCES punchcards (id) ON DELETE CASCADE,
  qr_code_data TEXT NOT NULL,
  created_at TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP
  WITH
    TIME ZONE
);

-- Enable RLS on the qr_codes table
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- Allow store owners to select QR codes for their punchcards
CREATE POLICY select_qr_codes ON qr_codes FOR
SELECT
  USING (
    EXISTS (
      SELECT
        1
      FROM
        punchcards
      WHERE
        punchcards.id = qr_codes.punchcard_id
        AND EXISTS (
          SELECT
            1
          FROM
            stores
          WHERE
            stores.id = punchcards.store_id
            AND auth.uid () = stores.user_id
        )
    )
  );

-- Allow store owners to insert QR codes for their punchcards
CREATE POLICY insert_qr_codes ON qr_codes FOR INSERT
WITH
  CHECK (
    EXISTS (
      SELECT
        1
      FROM
        punchcards
      WHERE
        punchcards.id = qr_codes.punchcard_id
        AND EXISTS (
          SELECT
            1
          FROM
            stores
          WHERE
            stores.id = punchcards.store_id
            AND auth.uid () = stores.user_id
        )
    )
  );

-- Allow store owners to update QR codes for their punchcards
CREATE POLICY update_qr_codes ON qr_codes FOR
UPDATE USING (
  EXISTS (
    SELECT
      1
    FROM
      punchcards
    WHERE
      punchcards.id = qr_codes.punchcard_id
      AND EXISTS (
        SELECT
          1
        FROM
          stores
        WHERE
          stores.id = punchcards.store_id
          AND auth.uid () = stores.user_id
      )
  )
);

-- Allow store owners to delete QR codes for their punchcards
CREATE POLICY delete_qr_codes ON qr_codes FOR DELETE USING (
  EXISTS (
    SELECT
      1
    FROM
      punchcards
    WHERE
      punchcards.id = qr_codes.punchcard_id
      AND EXISTS (
        SELECT
          1
        FROM
          stores
        WHERE
          stores.id = punchcards.store_id
          AND auth.uid () = stores.user_id
      )
  )
);

----------------------------------------------------------------------
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  punchcard_id UUID NOT NULL REFERENCES punchcards (id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_date TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    description TEXT,
    created_at TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP
  WITH
    TIME ZONE
);

-- Enable RLS on the transactions table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own transactions
CREATE POLICY select_own_transactions ON transactions FOR
SELECT
  USING (auth.uid () = user_id);

-- Allow users to insert a transaction for themselves
CREATE POLICY insert_own_transactions ON transactions FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

-- Allow users to update their own transactions
CREATE POLICY update_own_transactions ON transactions FOR
UPDATE USING (auth.uid () = user_id);

-- Allow users to delete their own transactions
CREATE POLICY delete_own_transactions ON transactions FOR DELETE USING (auth.uid () = user_id);

----------------------------------------------------------------------
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP
  WITH
    TIME ZONE
);

-- Enable RLS on the notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own notifications
CREATE POLICY select_own_notifications ON notifications FOR
SELECT
  USING (auth.uid () = user_id);

-- Allow users to insert a notification for themselves
CREATE POLICY insert_own_notifications ON notifications FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

-- Allow users to update their own notifications
CREATE POLICY update_own_notifications ON notifications FOR
UPDATE USING (auth.uid () = user_id);

-- Allow users to delete their own notifications
CREATE POLICY delete_own_notifications ON notifications FOR DELETE USING (auth.uid () = user_id);

----------------------------------------------------------------------
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
  user_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  punchcard_id UUID REFERENCES punchcards (id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP
  WITH
    TIME ZONE DEFAULT current_timestamp,
    updated_at TIMESTAMP
  WITH
    TIME ZONE
);

-- Enable RLS on the reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own reviews
CREATE POLICY select_own_reviews ON reviews FOR
SELECT
  USING (auth.uid () = user_id);

-- Allow users to insert a review for themselves
CREATE POLICY insert_own_reviews ON reviews FOR INSERT
WITH
  CHECK (auth.uid () = user_id);

-- Allow users to update their own reviews
CREATE POLICY update_own_reviews ON reviews FOR
UPDATE USING (auth.uid () = user_id);

-- Allow users to delete their own reviews
CREATE POLICY delete_own_reviews ON reviews FOR DELETE USING (auth.uid () = user_id);

----------------------------------------------------------------------
-- Create triggers to handle the updated_at column
CREATE TRIGGER handle_updated_at_stores BEFORE
UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_punchcards BEFORE
UPDATE ON punchcards FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_user_punchcards BEFORE
UPDATE ON user_punchcards FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_qr_codes BEFORE
UPDATE ON qr_codes FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_transactions BEFORE
UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_notifications BEFORE
UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_reviews BEFORE
UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);

CREATE TRIGGER handle_updated_at_profiles BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION moddatetime (updated_at);
