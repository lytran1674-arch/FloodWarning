import { usePermission } from '../../shared/hooks/usePermission'

interface Props {
  require: keyof ReturnType<typeof usePermission>
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleGuard({ require, fallback = null, children }: Props) {
  const permissions = usePermission()
  return permissions[require] ? <>{children}</> : <>{fallback}</>
}