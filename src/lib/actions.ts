"use server";

import { Customer, Organization, Product } from "@prisma/client";
import { authOption, getServerAuthSession } from "./auth";
import { db } from "./db";

export async function getUserSession() {
  const session = await getServerAuthSession();

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}

export async function getUserOrganization(userId: string) {
  try {
    const org = await db.organization.findMany({
      where: {
        userId: userId,
      },
    });
    return org;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrganizationById(orgId: string) {
  if (!orgId) return;
  try {
    const org = await db.organization.findUnique({
      where: {
        orgId: orgId,
      },
    });
    return org;
  } catch (error) {
    console.log(error);
  }
}

export async function upsertOrganization(org: Organization) {
  if (!org.orgId) {
    console.log("Organization ID is required");
    return;
  }
  try {
    const OrganizationDetail = await db.organization.upsert({
      where: {
        orgId: org.orgId,
      },
      update: {
        name: org.name,
        gstno: org.gstno,
        companyEmail: org.companyEmail,
        companyPhone: org.companyPhone,
        address: org.address,
        city: org.city,
        zipCode: org.zipCode,
        state: org.state,
        country: org.country,
        updatedAt: org.updatedAt,
      },
      create: {
        user: {
          connect: {
            id: org.userId,
          },
        },
        orgId: org.orgId,
        name: org.name,
        gstno: org.gstno,
        companyEmail: org.companyEmail,
        companyPhone: org.companyPhone,
        address: org.address,
        city: org.city,
        zipCode: org.zipCode,
        state: org.state,
        country: org.country,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      },
    });
    return OrganizationDetail;
  } catch (error) {
    console.error(error);
  }
  return;
}

export async function getCustomersByOrgId(orgId: string) {
  if (!orgId) return;
  try {
    const customerDetail = await db.customer.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        Invoice: {
          where: {
            isPaid: false,
          },
          select: {
            totalAmount: true,
          },
        },
      },
    });
    return customerDetail;
  } catch (error) {
    console.error(error);
  }
}

export async function getProductsByOrgId(orgId: string) {
  if (!orgId) return;
  try {
    const ProductData = await db.product.findMany({
      where: {
        organizationId: orgId,
      },
    });
    return ProductData;
  } catch (error) {
    console.error(error);
  }
}

export async function upsertCustomer(customer: Customer) {
  if (!customer.email) {
    console.log("Customer Email is required");
  }
  try {
    const customerDetail = await db.customer.upsert({
      where: {
        id: customer.id,
      },
      update: {
        name: customer.name,
        gstno: customer.gstno,
        email: customer.email,
        phone: customer.phone,
        baddress: customer.baddress,
        saddress: customer.saddress,
      },
      create: {
        organization: {
          connect: {
            orgId: customer.organizationId,
          },
        },
        name: customer.name,
        gstno: customer.gstno,
        email: customer.email,
        phone: customer.phone,
        baddress: customer.baddress,
        saddress: customer.saddress,
        createdAt: customer.createdAt,
      },
    });
    return customerDetail;
  } catch (error) {
    console.error(error);
  }
}

export async function upsertProduct(product: Product) {
  if (!product.name) {
    console.log("Product Name is required");
  }

  try {
    const productDetail = await db.product.upsert({
      where: {
        id: product.id,
      },
      update: {
        name: product.name,
        price: product.price,
        taxRate: product.taxRate,
        unit: product.unit,
        hsnCode: product.hsnCode,
      },
      create: {
        organization: {
          connect: {
            orgId: product.organizationId
          }
        },
        name: product.name,
        price: product.price,
        taxRate: product.taxRate,
        unit: product.unit,
        hsnCode: product.hsnCode,
        createdAt: product.createdAt || new Date(),
      }
    })
    return productDetail
  } catch (error) {
    console.error(error)
  }
}

export async function deleteProductById(id: string) {
  if (!id) return;
  try {
     const productDetail = await db.product.delete({
      where: {
        id: id
      }
     })
     return productDetail
  } catch (error) {
    console.error(error)
  }
}

export async function deleteCustomerById(id: string) {
  if (!id) return;
  try {
    const customerDetail = await db.customer.delete({
      where: {
        id: id,
      },
    });
    return customerDetail;
  } catch (error) {
    console.log(error);
  }
}
