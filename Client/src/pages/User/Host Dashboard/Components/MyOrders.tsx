import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../../../components/ui/table";

const MyOrders: React.FC = () => {
  return (
    <>
      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">My Orders</h2>
        <div className="relative p-6 bg-white shadow rounded mb-5">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Pick Up</TableHead>
                <TableHead className="text-right">Drop Off</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Doe</TableCell>
                <TableCell>24-10-2024</TableCell>
                <TableCell className="text-right">25-10-2024</TableCell>
                <TableCell className="text-right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
