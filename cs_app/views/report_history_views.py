from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from ..models import RanReportParameter

import json


@login_required
def report_history_view(request):

    past_reports = RanReportParameter.objects.filter(user=request.user)[::-1]

    user = request.user

    menu_status = None

    additional_info = request.GET.get("additionalInfo", None)

    if additional_info:
        try:
            decoded_info = json.loads(additional_info)
            menu_status = decoded_info.get("menu_status")
        except (ValueError, TypeError):
            menu_status = None

    context = {"user": user, "past_reports": past_reports, "menu_status": menu_status}

    return render(request, "subpages/report_history.html", context)
