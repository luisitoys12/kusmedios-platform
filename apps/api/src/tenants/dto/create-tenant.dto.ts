export class CreateTenantDto {
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  email: string;
}
