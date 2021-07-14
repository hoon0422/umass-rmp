export function ConditionalWrapper({
  condition,
  wrap,
  children,
}: {
  condition: boolean;
  wrap: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}) {
  return condition ? <>{wrap(children)}</> : <>{children}</>;
}
