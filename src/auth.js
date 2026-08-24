import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tiiavyrxereitetmxoku.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8pC7xM3kL2nQ5rV6tY9uW1aS4dF7gH0j';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
