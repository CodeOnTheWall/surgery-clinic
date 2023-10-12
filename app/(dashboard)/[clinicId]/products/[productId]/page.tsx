interface ProductPageProps {
  params: {
    productId: string;
    clinicId: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  console.log(params);
  return <div>page</div>;
}
