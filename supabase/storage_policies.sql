-- ============================================================
-- STORAGE: bucket de logos das redes/estabelecimentos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "leitura publica de logos"
on storage.objects for select
using (bucket_id = 'logos');

create policy "upload restrito a pasta do proprio usuario"
on storage.objects for insert
with check (
  bucket_id = 'logos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "usuario substitui seu proprio arquivo"
on storage.objects for update
using (
  bucket_id = 'logos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
