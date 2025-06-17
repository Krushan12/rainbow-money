import sys
import json
from pathlib import Path
import pandas as pd
import pdfplumber

def extract_portfolio_data(pdf_path):
    """
    Extract portfolio data from CAMS consolidated statement PDF
    """
    portfolio_data = {
        "client": {
            "name": "",
            "pan": "",
            "email": ""
        },
        "funds": [],
        "summary": {
            "total_investment": 0,
            "current_value": 0,
        }
    }
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = pdf.pages[0].extract_text()
            
            # Extract client details
            import re
            name_match = re.search(r"Investor Name:\s*(.+)", text)
            pan_match = re.search(r"PAN:\s*([A-Z0-9]+)", text)
            email_match = re.search(r"Email:\s*(.+@.+\..+)", text)
            
            if name_match:
                portfolio_data["client"]["name"] = name_match.group(1).strip()
            if pan_match:
                portfolio_data["client"]["pan"] = pan_match.group(1).strip()
            if email_match:
                portfolio_data["client"]["email"] = email_match.group(1).strip()
            
            # Process each page for fund details
            for page in pdf.pages:
                text = page.extract_text()
                
                # Find fund blocks
                fund_blocks = re.finditer(
                    r"AMC:\s*(.+)\n"
                    r"Scheme:\s*(.+)\n"
                    r"ISIN:\s*([A-Z0-9]+)\n"
                    r"Asset Class:\s*(.+)\n"
                    r"Units:\s*([\d,.]+)\n"
                    r"NAV:\s*Rs\.\s*([\d,.]+)\n"
                    r"Current Value:\s*Rs\.\s*([\d,.]+)\n"
                    r"Transaction Date:\s*(.+)\n"
                    r"Amount Invested:\s*Rs\.\s*([\d,.]+)",
                    text
                )
                
                for match in fund_blocks:
                    fund_data = {
                        "amc": match.group(1).strip(),
                        "scheme_name": match.group(2).strip(),
                        "isin": match.group(3).strip(),
                        "asset_class": match.group(4).strip(),
                        "units": float(match.group(5).replace(",", "")),
                        "nav": float(match.group(6).replace(",", "")),
                        "current_value": float(match.group(7).replace(",", "")),
                        "transaction_date": match.group(8).strip(),
                        "amount_invested": float(match.group(9).replace(",", ""))
                    }
                    portfolio_data["funds"].append(fund_data)
                    portfolio_data["summary"]["current_value"] += fund_data["current_value"]
                    portfolio_data["summary"]["total_investment"] += fund_data["amount_invested"]
    
    except Exception as e:
        return {"error": str(e)}
    
    return portfolio_data

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "PDF path not provided"}))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    if not Path(pdf_path).exists():
        print(json.dumps({"error": "PDF file not found"}))
        sys.exit(1)
    
    # Extract data from PDF
    portfolio_data = extract_portfolio_data(pdf_path)
    
    # Output JSON to stdout
    print(json.dumps(portfolio_data))

if __name__ == "__main__":
    main()
