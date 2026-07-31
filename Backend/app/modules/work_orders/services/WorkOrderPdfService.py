from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

import base64
import hashlib
from io import BytesIO

from pyhanko.sign import signers
from pyhanko.sign.fields import SigFieldSpec
from pyhanko.pdf_utils.incremental_writer import (
    IncrementalPdfFileWriter,
)



from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


class WorkOrderPdfService:

    # Previous simple PDF generation implementation (commented out as per rules):
    # @staticmethod
    # def generate_pdf(work_order) -> bytes:
    #     buffer = BytesIO()
    #     document = SimpleDocTemplate(
    #         buffer,
    #         pagesize=A4,
    #         rightMargin = 15 * mm,
    #         leftMargin = 15 * mm,
    #         topMargin = 15 * mm,
    #         bottomMargin = 15 * mm,
    #     )
    #
    #     styles = getSampleStyleSheet()
    #     story = []
    #
    #     story.append(
    #         Paragraph(
    #         "<b>WORK ORDER</b>",
    #         styles["Title"],
    #         )
    #     )
    #     story.append(Spacer(1, 8 * mm))
    #
    #     information = [
    #         [
    #             "Work Order No.",
    #             work_order.work_order_number,
    #             "Date", str(work_order.work_order_created_at.date()
    #             ),
    #         ],
    #
    #         [
    #             "Project",
    #             work_order.project_name_snapshot,
    #             "Department",
    #             work_order.department_name_snapshot,
    #         ],
    #         [
    #             "Developer",
    #             work_order.developer_name_snapshot,
    #             "Officer",
    #             work_order.officer_name_snapshot,
    #         ],
    #     ]
    #
    #     information_table = Table(
    #         information,
    #         colWidths=[
    #             35 * mm,
    #             55 * mm,
    #             30 * mm,
    #             55 * mm,
    #         ],
    #     )
    #
    #     information_table.setStyle(
    #         TableStyle(
    #             [
    #                 ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
    #                 ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
    #                 ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
    #                 ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
    #                 ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    #                 ("LEFTPADDING", (0, 0), (-1, -1), 5),
    #                 ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    #                 ("TOPPADDING", (0, 0), (-1, -1), 5),
    #                 ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    #             ]
    #         )
    #     )
    #
    #     story.append(information_table)
    #     story.append(Spacer(1, 10 * mm))
    #
    #     assignment_data = [
    #         [
    #             "Tier",
    #             "Monthly Salary",
    #             "Start Date",
    #             "End Date",
    #         ],
    #         [
    #             str(work_order.tier),
    #             f"Rs. {work_order.monthly_salary}",
    #             str(work_order.work_order_start_date),
    #             str(work_order.work_order_end_date),
    #         ],
    #     ]
    #
    #     assignment_table = Table(
    #         assignment_data,
    #         colWidths=[35 * mm, 50 * mm, 45 * mm, 45 * mm],
    #     )
    #
    #     assignment_table.setStyle(
    #         TableStyle(
    #             [
    #                 ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
    #                 ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    #                 ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    #                 ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    #                 ("TOPPADDING", (0, 0), (-1, -1), 7),
    #                 ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    #             ]
    #         )
    #     )
    #
    #     story.append(assignment_table)
    #     story.append(Spacer(1, 10 * mm))
    #
    #     if work_order.work_order_description:
    #         story.append(
    #             Paragraph(
    #                 "<b>Description</b>",
    #                 styles["Heading3"],
    #             )
    #         )
    #
    #         story.append(
    #             Paragraph(
    #                 work_order.work_order_description,
    #                 styles["BodyText"],
    #             )
    #         )
    #
    #     story.append(Spacer(1, 25 * mm))
    #
    #     story.append(
    #         Paragraph(
    #             "Digitally signed by:<br/>"
    #             f"<b>{work_order.officer_name_snapshot}</b>",
    #             styles["BodyText"],
    #         )
    #     )
    #
    #     document.build(story)
    #
    #     pdf_bytes = buffer.getvalue()
    #     buffer.close()
    #
    #     return pdf_bytes

    @staticmethod
    def generate_pdf(work_order) -> bytes:
        buffer = BytesIO()
        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=10 * mm,
            leftMargin=10 * mm,
            topMargin=10 * mm,
            bottomMargin=10 * mm,
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "OrgHeaderTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=13,
            alignment=1,
            textColor=colors.HexColor("#1A2B4C"),
        )

        subtitle_style = ParagraphStyle(
            "OrgHeaderSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            alignment=1,
            textColor=colors.HexColor("#333333"),
        )

        wo_box_title = ParagraphStyle(
            "WOBoxTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=12,
            alignment=1,
        )

        body_style = ParagraphStyle(
            "WOBodyText",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=11,
        )

        body_bold = ParagraphStyle(
            "WOBodyBold",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
        )

        table_cell_style = ParagraphStyle(
            "WOTableCell",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=7,
            leading=9,
            alignment=1,
        )

        table_header_style = ParagraphStyle(
            "WOTableHeader",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7,
            leading=9,
            alignment=1,
        )

        story = []

        # 1. Header Org Info
        story.append(Paragraph("<b>नेशनल इंफॉर्मेटिक्स सेंटर सर्विसेज इन्कॉर्पोरेटेड</b>", subtitle_style))
        story.append(Paragraph("<b>National Informatics Centre Services Incorporated</b>", title_style))
        story.append(Paragraph("(रा. सू. वि. के. के अन्तर्गत भारत सरकार का एक उद्यम)", subtitle_style))
        story.append(Paragraph("(A Government of India Enterprise under NIC)", subtitle_style))
        story.append(Paragraph("इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी मंत्रालय", subtitle_style))
        story.append(Paragraph("Ministry of Electronics and Information Technology", subtitle_style))
        story.append(Spacer(1, 2 * mm))

        # Work Order Subheader Title Box
        story.append(Paragraph("<b>Work Order</b>", wo_box_title))
        story.append(Paragraph("(GSTIN No. of NICSI: 07AAACN2185J1ZE)", subtitle_style))
        story.append(Spacer(1, 3 * mm))

        # 2. Metadata Grid Table
        created_date = (
            work_order.work_order_created_at.strftime("%d-%b-%Y").upper()
            if getattr(work_order, "work_order_created_at", None)
            else ""
        )
        prj_code = f"S{work_order.project_id}MPTR"

        issued_to_text = (
            f"<b>Name:</b> {work_order.developer_name_snapshot}<br/>"
            f"<b>Address:</b> Block C-324, Sector-62, Noida, Uttar Pradesh - 201301<br/>"
            f"<b>Contact Person:</b> {work_order.officer_name_snapshot}<br/>"
            f"<b>Phone No.:</b> 9873759782<br/>"
            f"<b>Email ID:</b> hr.support@aeologic.com"
        )

        meta_table_data = [
            [
                Paragraph("<b>Work Order No:-</b>", body_bold),
                Paragraph(str(work_order.work_order_number), body_style),
                Paragraph("<b>Date</b>", body_bold),
                Paragraph(created_date, body_style),
            ],
            [
                Paragraph("<b>Project No:-</b>", body_bold),
                Paragraph(prj_code, body_style),
                Paragraph("<b>PI Number:</b>", body_bold),
                Paragraph("", body_style),
            ],
            [
                Paragraph("<b>Project Name:-</b>", body_bold),
                Paragraph(str(work_order.project_name_snapshot), body_style),
                "",
                "",
            ],
            [
                Paragraph("<b>Issued to:</b>", body_bold),
                Paragraph(issued_to_text, body_style),
                "",
                "",
            ],
        ]

        meta_table = Table(
            meta_table_data,
            colWidths=[28 * mm, 62 * mm, 25 * mm, 75 * mm],
        )

        meta_table.setStyle(
            TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                ("SPAN", (1, 2), (3, 2)),
                ("SPAN", (1, 3), (3, 3)),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ])
        )
        story.append(meta_table)
        story.append(Spacer(1, 3 * mm))

        # 3. Subject and Salutation
        dept_name = work_order.department_name_snapshot or "Department"
        subj_text = (
            "<b>Subject:</b> Empanelment of agencies for Design, Development, "
            "Implementation and Maintenance of Application Software and Website"
        )
        story.append(Paragraph(subj_text, body_style))
        story.append(Spacer(1, 2 * mm))

        salut_text = (
            "Sir,<br/>"
            "In reference to your Empanelment with NICSI / Department, Issued with the approval of "
            "the Competent Authority, I have been directed to place an order for Design, Development, "
            "Implementation and Maintenance of Application Software and Website as per the details and "
            "Terms & Conditions given below:"
        )
        story.append(Paragraph(salut_text, body_style))
        story.append(Spacer(1, 3 * mm))

        # 4. Main Financial Table
        months = getattr(work_order, "number_of_months", None) or 1
        salary = float(getattr(work_order, "monthly_salary", 0) or 0)
        base_amount = salary * months * 1
        igst_rate = 0.18
        igst_amount = base_amount * igst_rate
        grand_total = base_amount + igst_amount

        start_str = (
            work_order.work_order_start_date.strftime("%d/%m/%Y")
            if getattr(work_order, "work_order_start_date", None)
            else ""
        )
        end_str = (
            work_order.work_order_end_date.strftime("%d/%m/%Y")
            if getattr(work_order, "work_order_end_date", None)
            else ""
        )
        dates_str = f"{start_str} To<br/>{end_str}"
        months_display = f"{months} Month(s)"

        desc_display = (
            work_order.work_order_description
            or f"Level {work_order.tier} (Minimum work experience 0+ years) Tier - {work_order.tier}"
        )

        headers = [
            Paragraph("S.<br/>No", table_header_style),
            Paragraph("HSN/<br/>SAC<br/>Code", table_header_style),
            Paragraph("Description", table_header_style),
            Paragraph("No of<br/>Persons<br/>Required<br/>(A)", table_header_style),
            Paragraph("Required<br/>Period<br/>(No. of Months/<br/>days) (B)", table_header_style),
            Paragraph("Unit Rate per<br/>Month<br/>(excluding<br/>Taxes) (C)", table_header_style),
            Paragraph("Date of<br/>Deployment<br/>(From/To) (D)", table_header_style),
            Paragraph("Total<br/>Amount<br/>(AxBxC) (E)", table_header_style),
            Paragraph("CGST<br/>(%)<br/>/Amount (F)", table_header_style),
            Paragraph("SGST<br/>(%)<br/>/Amount (G)", table_header_style),
            Paragraph("IGST<br/>(%)<br/>/Amount (H)", table_header_style),
        ]

        col_widths = [
            8 * mm,
            14 * mm,
            38 * mm,
            12 * mm,
            20 * mm,
            20 * mm,
            22 * mm,
            20 * mm,
            12 * mm,
            12 * mm,
            12 * mm,
        ]

        item_row = [
            Paragraph("1", table_cell_style),
            Paragraph("998314", table_cell_style),
            Paragraph(desc_display, table_cell_style),
            Paragraph("1", table_cell_style),
            Paragraph(months_display, table_cell_style),
            Paragraph(f"{salary:,.2f}", table_cell_style),
            Paragraph(dates_str, table_cell_style),
            Paragraph(f"{base_amount:,.2f}", table_cell_style),
            Paragraph("0.00%<br/>0.00", table_cell_style),
            Paragraph("0.00%<br/>0.00", table_cell_style),
            Paragraph(f"18.00%<br/>{igst_amount:,.2f}", table_cell_style),
        ]

        total_row = [
            Paragraph("<b>Total Amount in Rs.</b>", ParagraphStyle("RBold", parent=table_cell_style, fontName="Helvetica-Bold", alignment=2)),
            "", "", "", "", "", "",
            Paragraph(f"<b>{base_amount:,.2f}</b>", ParagraphStyle("RCenterBold", parent=table_cell_style, fontName="Helvetica-Bold")),
            Paragraph("0.00", table_cell_style),
            Paragraph("0.00", table_cell_style),
            Paragraph(f"<b>{igst_amount:,.2f}</b>", ParagraphStyle("RCenterBold", parent=table_cell_style, fontName="Helvetica-Bold")),
        ]

        grand_total_row = [
            Paragraph("<b>Grand Total (in Rs.):-</b>", ParagraphStyle("RBoldG", parent=table_cell_style, fontName="Helvetica-Bold", alignment=2)),
            "", "", "", "", "", "", "", "", "",
            Paragraph(f"<b>{grand_total:,.0f}</b>", ParagraphStyle("RCenterBoldG", parent=table_cell_style, fontName="Helvetica-Bold")),
        ]

        fin_table_data = [headers, item_row, total_row, grand_total_row]

        fin_table = Table(fin_table_data, colWidths=col_widths)
        fin_table.setStyle(
            TableStyle([
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("SPAN", (0, 2), (6, 2)),
                ("SPAN", (0, 3), (9, 3)),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F5F5F5")),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
            ])
        )
        story.append(fin_table)
        story.append(Spacer(1, 3 * mm))

        # 5. Location and Contact Info
        location_text = (
            f"To be provided at the office of <b>{dept_name}</b>. Location: 3rd Floor, Secretariat Complex, NIC, Agartala, Tripura - 799010.<br/>"
            f"The contact person is <b>{work_order.officer_name_snapshot}</b> (Contact: 9436131067, email: {work_order.officer_id}@nic.in)."
        )
        story.append(Paragraph(location_text, body_style))
        story.append(Spacer(1, 3 * mm))

        # 6. Terms and Conditions
        tc_text = (
            "<b>1. PERFORMANCE BANK GUARANTEE</b><br/>"
            "i. The agency is required to ensure submission of Performance Bank Guarantee (PBG) equivalent to 3% of the Work Order value.<br/>"
            "ii. PBG will be in the form of Demand Draft / Bank Guarantee from a Commercial bank.<br/>"
            "iii. The PBG should remain valid for 60 days beyond completion of contractual obligations.<br/>"
            "iv. PBG must be submitted after award of contract.<br/><br/>"
            "<b>2. PAYMENT TERMS</b><br/>"
            "Payment will be made in Indian Rupees only.<br/>"
            "a) Time and Material (T and M) Mode: Monthly payment based on actual duration of services rendered.<br/>"
            "b) Fixed Price Project (FPP) Mode: Payment made on completion of milestone.<br/><br/>"
            "<b>3. PENALTIES</b><br/>"
            "Any unjustified delay beyond schedule will render vendor liable for liquidated damages at 0.5% per week up to a maximum of 10% of WO value."
        )
        story.append(Paragraph(tc_text, body_style))
        story.append(Spacer(1, 4 * mm))

        # 7. Signature & Copies section
        sig_data = [
            [
                Paragraph("", body_style),
                Paragraph(f"For <b>National Informatics Centre Services Inc / {dept_name}</b>", body_style),
            ],
            [
                Paragraph(
                    f"<b>Copy To:</b><br/>"
                    f"1. Accounts Section<br/>"
                    f"2. Project Manager ({work_order.officer_name_snapshot})<br/>"
                    f"3. Guard File.",
                    body_style
                ),
                Paragraph(
                    f"<br/><br/><b>({work_order.officer_name_snapshot})</b><br/>"
                    f"Chief General Manager & Project Manager",
                    body_style
                )
            ]
        ]
        sig_table = Table(sig_data, colWidths=[95 * mm, 95 * mm])
        sig_table.setStyle(
            TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ])
        )
        story.append(sig_table)
        story.append(Spacer(1, 3 * mm))

        # Digital Signature Notice
        signed_at_val = getattr(work_order, "signed_at", None) or getattr(work_order, "work_order_created_at", None)
        signed_at_str = (
            signed_at_val.strftime("%a %b %d %H:%M:%S IST %Y")
            if signed_at_val
            else ""
        )
        digi_sig_text = (
            f"<font size='7' color='#555555'><b>Digitally signed by {work_order.officer_name_snapshot.upper()}</b><br/>"
            f"Date: {signed_at_str}</font>"
        )
        story.append(Paragraph(digi_sig_text, ParagraphStyle("DigiSig", parent=styles["Normal"], alignment=2)))

        document.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()

        return pdf_bytes
    

def encode_pdf(pdf_bytes: bytes) -> str:
    return base64.b64encode(
        pdf_bytes
    ).decode("utf-8")
    
def decode_pdf(pdf_base64: str) -> bytes:
    return base64.b64decode(
        pdf_base64,
        validate=True,
    )

def calculate_sha256(pdf_bytes: bytes) -> str:
    return hashlib.sha256(
        pdf_bytes
    ).hexdigest()


class WorkOrderSigningService:
    @staticmethod
    def sign_pdf(
        pdf_bytes: bytes,
        p12_file_path: str,
        p12_password: str,
        reason: str,
        location: str,
    ) -> bytes:
        
        signer = signers.SimpleSigner.load_pkcs12(
            pfx_file=p12_file_path,
            passphrase=p12_password.encode("utf-8"),
        )
        
        if signer is None:
            raise RuntimeError("Failed to load PKCS#12 signer from provided file and password")

        input_buffer = BytesIO(pdf_bytes)
        output_buffer = BytesIO()

        writer = IncrementalPdfFileWriter(
            input_buffer
        )

        signature_metadata = signers.PdfSignatureMetadata(
            field_name="OfficerSignature",
            reason=reason,
            location=location,
        )


        pdf_signer = signers.PdfSigner(
            signature_metadata,
            signer=signer,
            new_field_spec=SigFieldSpec(
                sig_field_name="OfficerSignature",
                box=(350, 60, 550, 130),
                on_page=-1,
            ),
        )

        pdf_signer.sign_pdf(
            writer,
            output=output_buffer,
        )

        return output_buffer.getvalue()