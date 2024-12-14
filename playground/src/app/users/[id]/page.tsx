export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <h2>EDIT {params.id}</h2>
    </div>
  );
}
