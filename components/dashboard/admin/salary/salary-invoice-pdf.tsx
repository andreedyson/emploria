/* eslint-disable jsx-a11y/alt-text */

import { months } from "@/constants";
import { getImageUrl } from "@/lib/supabase";
import { convertRupiah, formatDate } from "@/lib/utils";
import { SalaryColumnsProps } from "@/types/admin/salary";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@ag-media/react-pdf-table";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "Plus Jakarta Sans",
  fonts: [
    {
      src: "/fonts/PlusJakartaSans-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/PlusJakartaSans-SemiBold.ttf",
      fontWeight: 600,
    },
    {
      src: "/fonts/PlusJakartaSans-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/PlusJakartaSans-BoldItalic.ttf",
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10, fontFamily: "Plus Jakarta Sans" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  companyInfo: { flexDirection: "row", alignItems: "center", gap: 2 },
  meta: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { width: 40, height: 40, marginRight: 8 },
  title: { fontSize: 16, fontWeight: "bold", fontStyle: "italic" },
  section: { marginBottom: 12 },
  separator: { borderBottomWidth: 1, marginVertical: 12 },
  statusBoxBase: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontWeight: "bold",
  },
  tableHeader: {
    backgroundColor: "#59b4f7",
    padding: "4px 6px",
    color: "white",
  },
  tableCell: {
    padding: 6,
  },
  tableNumber: { width: "100%", alignItems: "flex-end" },
  late: {
    color: "red",
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "right",
    color: "#04f614",
  },
});

export default function SalaryInvoicePDF({
  data,
}: {
  data: SalaryColumnsProps;
}) {
  const {
    id,
    month,
    year,
    company,
    employee,
    date,
    status,
    paidAt,
    baseSalary,
    bonus = 0,
    deduction = 0,
    attendanceBonusRate = 0,
    lateAttendancePenaltyRate = 0,
    totalPresentAttendance,
    totalLateAttendance,
    total,
  } = data;

  const monthLabel = months.find((m) => m.value === month)?.label;
  const formattedDate = formatDate(date);
  const formattedPaidAt = paidAt ? formatDate(paidAt) : "-";

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Image
              src={getImageUrl(company.image as string, "companies")}
              style={styles.logo}
            />
            <Text style={styles.title}>{company.name}</Text>
          </View>
          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
            {monthLabel} {year}
          </Text>
        </View>

        {/* Salary ID */}
        <View
          style={{
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Salary ID </Text>
          <Text>{id}</Text>
        </View>
        {/* Meta */}
        <View style={styles.meta}>
          <View style={{ marginBottom: 6 }}>
            <Text style={{ marginBottom: 3 }}>
              <Text style={{ fontWeight: "bold" }}>Generated On: </Text>
              {formattedDate}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Paid At: </Text>
              {formattedPaidAt}
            </Text>
          </View>
          <View
            style={{
              ...styles.statusBoxBase,
              backgroundColor: status === "PAID" ? "lime" : "#eee",
              color: "white",
            }}
          >
            <Text>{status}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Employee Info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          {employee?.image && (
            <Image
              src={getImageUrl(employee.image as string, "users")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 30,
                marginRight: 12,
              }}
            />
          )}
          <View>
            <Text style={{ fontWeight: "bold" }}>{employee.name}</Text>
            <Text>{employee.id}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Salary Breakdown */}
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          Salary Breakdown
        </Text>
        <Table>
          <TableHeader>
            <TableCell style={styles.tableHeader}>Type</TableCell>
            <TableCell style={styles.tableHeader}>
              <View style={styles.tableNumber}>
                <Text>Total</Text>
              </View>
            </TableCell>
          </TableHeader>
          <TableRow>
            <TableCell style={styles.tableCell}>Base Salary</TableCell>
            <TableCell style={styles.tableCell}>
              <View style={styles.tableNumber}>
                <Text>{convertRupiah(baseSalary)}</Text>
              </View>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={styles.tableCell}>Bonus</TableCell>
            <TableCell style={styles.tableCell}>
              <View style={styles.tableNumber}>
                <Text>{bonus ? convertRupiah(bonus) : "-"}</Text>
              </View>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={styles.tableCell}>Deduction</TableCell>
            <TableCell style={styles.tableCell}>
              <View style={styles.tableNumber}>
                <Text style={styles.late}>
                  {deduction ? `- ${convertRupiah(deduction)}` : "-"}
                </Text>
              </View>
            </TableCell>
          </TableRow>
        </Table>

        <View style={styles.separator} />

        {/* Attendance Breakdown */}
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          Attendance Bonus & Penalty
        </Text>
        <Table>
          <TableHeader>
            <TableCell style={styles.tableHeader}>Type</TableCell>
            <TableCell style={styles.tableHeader}>
              <View style={styles.tableNumber}>
                <Text>Total</Text>
              </View>
            </TableCell>
          </TableHeader>
          <TableRow>
            <TableCell style={styles.tableCell}>
              Present ({totalPresentAttendance} days)
            </TableCell>
            <TableCell style={styles.tableCell}>
              <View style={styles.tableNumber}>
                <Text>
                  {convertRupiah(
                    totalPresentAttendance * (attendanceBonusRate ?? 0),
                  )}
                </Text>
              </View>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={styles.tableCell}>
              Late ({totalLateAttendance} days)
            </TableCell>
            <TableCell style={styles.tableCell}>
              <View style={styles.tableNumber}>
                <Text style={styles.late}>
                  {totalLateAttendance
                    ? `- ${convertRupiah(totalLateAttendance * (lateAttendancePenaltyRate ?? 0))}`
                    : "-"}
                </Text>
              </View>
            </TableCell>
          </TableRow>
        </Table>

        <View style={styles.separator} />

        {/* Total */}
        <Text style={styles.total}>Total: {convertRupiah(total)}</Text>
      </Page>
    </Document>
  );
}
