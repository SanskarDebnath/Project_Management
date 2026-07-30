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



class WorkOrderPdfService:

    @staticmethod
    def generate_pdf(work_order) -> bytes:
        buffer = BytesIO()
        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin = 15 * mm,
            leftMargin = 15 * mm,
            topMargin = 15 * mm,
            bottomMargin = 15 * mm,
        )

        styles = getSampleStyleSheet()
        story = []

        story.append(
            Paragraph(
            "<b>WORK ORDER</b>",
            styles["Title"],
            )
        )
        story.append(Spacer(1, 8 * mm))

        information = [
            [
                "Work Order No.",
                work_order.work_order_number,
                "Date", str(work_order.work_order_created_at.date()
                ),
            ],

            [
                "Project",
                work_order.project_name_snapshot,
                "Department",
                work_order.department_name_snapshot,
            ],
            [
                "Developer",
                work_order.developer_name_snapshot,
                "Officer",
                work_order.officer_name_snapshot,
            ],
        ]

        information_table = Table(
            information,
            colWidths=[
                35 * mm,
                55 * mm,
                30 * mm,
                55 * mm,
            ],
        )

        information_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ]
            )
        )

        story.append(information_table)
        story.append(Spacer(1, 10 * mm))

        assignment_data = [
            [
                "Tier",
                "Monthly Salary",
                "Start Date",
                "End Date",
            ],
            [
                str(work_order.tier),
                f"Rs. {work_order.monthly_salary}",
                str(work_order.work_order_start_date),
                str(work_order.work_order_end_date),
            ],
        ]

        assignment_table = Table(
            assignment_data,
            colWidths=[35 * mm, 50 * mm, 45 * mm, 45 * mm],
        )

        assignment_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 7),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ]
            )
        )

        story.append(assignment_table)
        story.append(Spacer(1, 10 * mm))

        if work_order.work_order_description:
            story.append(
                Paragraph(
                    "<b>Description</b>",
                    styles["Heading3"],
                )
            )

            story.append(
                Paragraph(
                    work_order.work_order_description,
                    styles["BodyText"],
                )
            )

        story.append(Spacer(1, 25 * mm))

        story.append(
            Paragraph(
                "Digitally signed by:<br/>"
                f"<b>{work_order.officer_name_snapshot}</b>",
                styles["BodyText"],
            )
        )

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